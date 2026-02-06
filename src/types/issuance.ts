import type { ProductType } from './common';

export type IssuanceStepKey = 'DATA' | 'LOCATION' | 'PHOTOS' | 'REVIEW' | 'CONFIRM';

export interface LocationData {
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: string;
  longitude?: string;
}

export interface CommonData {
  insuredName: string;
  insuredRfc?: string;
  insuredEmail?: string;
}

export interface BoatData {
  boatBrand?: string;
  boatModel?: string;
  boatLength?: string;
  registration?: string;
}

export interface PropertyData {
  businessName?: string;
  activity?: string;
  squareMeters?: string;
}

export interface IssuanceFormData {
  common: CommonData;
  location: LocationData;
  boat?: BoatData;
  property?: PropertyData;
}

export interface IssuancePhoto {
  id: string;
  label: string;
  description?: string;
  fileName?: string;
  previewUrl?: string;
}

export interface IssuanceSession {
  id: string;
  quoteId: string;
  productType: ProductType;
  currentStep: IssuanceStepKey;
  data: IssuanceFormData;
  photos: IssuancePhoto[];
  status: 'IN_PROGRESS' | 'COMPLETED';
  policyId?: string;
}
