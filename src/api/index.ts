import type { User } from '../types/auth';
import type { Quote } from '../types/quote';
import type { Policy } from '../types/policy';
import type { IssuanceSession } from '../types/issuance';
import {
  mockGetPolicy,
  mockGetQuote,
  mockGetQuotes,
  mockIssuePolicy,
  mockLogin,
  mockStartIssuance,
  mockSubmitIssuanceStep,
  mockUploadPhoto
} from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Por ahora siempre usamos mocks. Cuando se conecte un backend real:
// - Verificar si existe API_BASE_URL
// - Usar fetch/axios a `${API_BASE_URL}/...`
// - Mantener la misma firma de las funciones exportadas.

export const login = async (username: string, password: string): Promise<User> => {
  if (!API_BASE_URL) {
    return mockLogin(username, password);
  }
  // TODO: conectar endpoint real
  return mockLogin(username, password);
};

export const getQuotes = async (): Promise<Quote[]> => {
  if (!API_BASE_URL) {
    return mockGetQuotes();
  }
  // TODO: conectar endpoint real
  return mockGetQuotes();
};

export const getQuote = async (id: string): Promise<Quote> => {
  if (!API_BASE_URL) {
    return mockGetQuote(id);
  }
  // TODO: conectar endpoint real
  return mockGetQuote(id);
};

export const startIssuance = async (quoteId: string): Promise<IssuanceSession> => {
  if (!API_BASE_URL) {
    return mockStartIssuance(quoteId);
  }
  // TODO: conectar endpoint real
  return mockStartIssuance(quoteId);
};

export const submitIssuanceStep = async (
  issuanceId: string,
  payload: Partial<IssuanceSession>
): Promise<IssuanceSession> => {
  if (!API_BASE_URL) {
    return mockSubmitIssuanceStep(issuanceId, payload);
  }
  // TODO: conectar endpoint real
  return mockSubmitIssuanceStep(issuanceId, payload);
};

export const uploadPhoto = async (
  issuanceId: string,
  stepId: string,
  file: File
): Promise<IssuanceSession> => {
  if (!API_BASE_URL) {
    return mockUploadPhoto(issuanceId, stepId, file);
  }
  // TODO: conectar endpoint real
  return mockUploadPhoto(issuanceId, stepId, file);
};

export const issuePolicy = async (issuanceId: string): Promise<Policy> => {
  if (!API_BASE_URL) {
    return mockIssuePolicy(issuanceId);
  }
  // TODO: conectar endpoint real
  return mockIssuePolicy(issuanceId);
};

export const getPolicy = async (policyId: string): Promise<Policy> => {
  if (!API_BASE_URL) {
    return mockGetPolicy(policyId);
  }
  // TODO: conectar endpoint real
  return mockGetPolicy(policyId);
};

