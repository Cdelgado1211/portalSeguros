import { mockQuotes } from '../mocks/quotes';
import { mockUser } from '../mocks/users';
import type { User } from '../types/auth';
import type { Policy } from '../types/policy';
import type { Quote } from '../types/quote';
import type { IssuanceFormData, IssuanceSession } from '../types/issuance';
import { delay } from '../utils/delay';
import { createPolicyPdf } from '../utils/pdf';

let issuances: IssuanceSession[] = [];
let policies: Policy[] = [];

export const mockLogin = async (username: string, password: string): Promise<User> => {
  await delay(600);
  if (!username || !password) {
    throw new Error('Credenciales inválidas');
  }
  return mockUser;
};

export const mockGetQuotes = async (): Promise<Quote[]> => {
  await delay(500);
  return [...mockQuotes];
};

export const mockGetQuote = async (id: string): Promise<Quote> => {
  await delay(400);
  const quote = mockQuotes.find((q) => q.id === id);
  if (!quote) throw new Error('Cotización no encontrada');

  const issuance = issuances.find((i) => i.quoteId === id && i.status === 'IN_PROGRESS');
  return {
    ...quote,
    ongoingIssuanceId: issuance?.id
  };
};

export const mockStartIssuance = async (quoteId: string): Promise<IssuanceSession> => {
  await delay(500);
  const existing = issuances.find((i) => i.quoteId === quoteId && i.status === 'IN_PROGRESS');
  if (existing) return existing;

  const quote = mockQuotes.find((q) => q.id === quoteId);
  if (!quote) throw new Error('Cotización no encontrada');

  const id = `iss-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const session: IssuanceSession = {
    id,
    quoteId,
    productType: quote.productType,
    currentStep: 'DATA',
    status: 'IN_PROGRESS',
    data: {
      common: {
        insuredName: quote.customerName
      },
      location: {
        addressLine: '',
        city: '',
        state: '',
        postalCode: ''
      },
      boat:
        quote.productType === 'BOATS'
          ? {
              boatBrand: '',
              boatModel: '',
              boatLength: '',
              registration: ''
            }
          : undefined,
      property:
        quote.productType === 'PROPERTY'
          ? {
              businessName: quote.riskObjectName,
              activity: '',
              squareMeters: ''
            }
          : undefined
    },
    photos: []
  };

  issuances.push(session);
  return session;
};

export const mockSubmitIssuanceStep = async (
  issuanceId: string,
  payload: Partial<IssuanceSession>
): Promise<IssuanceSession> => {
  await delay(400);
  const index = issuances.findIndex((i) => i.id === issuanceId);
  if (index === -1) {
    throw new Error('Emisión no encontrada');
  }
  const current = issuances[index];
  const updated: IssuanceSession = {
    ...current,
    ...payload,
    data: {
      ...current.data,
      ...(payload.data ?? {}),
      common: {
        ...current.data.common,
        ...(payload.data?.common ?? {})
      },
      location: {
        ...current.data.location,
        ...(payload.data?.location ?? {})
      },
      boat: {
        ...current.data.boat,
        ...(payload.data?.boat ?? {})
      },
      property: {
        ...current.data.property,
        ...(payload.data?.property ?? {})
      }
    },
    photos: payload.photos ?? current.photos
  };
  issuances[index] = updated;
  return updated;
};

export const mockUploadPhoto = async (
  issuanceId: string,
  stepId: string,
  file: File
): Promise<IssuanceSession> => {
  await delay(300);
  const index = issuances.findIndex((i) => i.id === issuanceId);
  if (index === -1) {
    throw new Error('Emisión no encontrada');
  }
  const current = issuances[index];
  const photoIndex = current.photos.findIndex((p) => p.id === stepId);
  const photo = {
    id: stepId,
    label: current.photos[photoIndex]?.label ?? '',
    description: current.photos[photoIndex]?.description,
    fileName: file.name,
    previewUrl: current.photos[photoIndex]?.previewUrl
  };
  let photos = [...current.photos];
  if (photoIndex === -1) {
    photos.push(photo);
  } else {
    photos[photoIndex] = photo;
  }
  const updated: IssuanceSession = { ...current, photos };
  issuances[index] = updated;
  return updated;
};

export const mockIssuePolicy = async (issuanceId: string): Promise<Policy> => {
  await delay(700);
  const index = issuances.findIndex((i) => i.id === issuanceId);
  if (index === -1) throw new Error('Emisión no encontrada');
  const issuance = issuances[index];
  const quote = mockQuotes.find((q) => q.id === issuance.quoteId);
  if (!quote) throw new Error('Cotización no encontrada');

  const policyId = `pol-${Date.now()}`;
  const policyNumber = `${quote.number}-POL`;
  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  const basePolicy: Policy = {
    id: policyId,
    quoteId: quote.id,
    policyNumber,
    productName: quote.productName,
    insuredName: quote.customerName,
    effectiveDate: today.toISOString(),
    expiryDate: nextYear.toISOString(),
    pdfUrl: '',
    emailSent: true,
    notificationEmail: issuance.data.common.insuredEmail
  };

  const pdfUrl = await createPolicyPdf(basePolicy);

  const policy: Policy = {
    ...basePolicy,
    pdfUrl
  };

  policies.push(policy);
  issuances[index] = { ...issuances[index], status: 'COMPLETED', policyId: policyId };
  return policy;
};

export const mockGetPolicy = async (policyId: string): Promise<Policy> => {
  await delay(400);
  const policy = policies.find((p) => p.id === policyId);
  if (!policy) {
    throw new Error('Póliza no encontrada');
  }
  return policy;
};
