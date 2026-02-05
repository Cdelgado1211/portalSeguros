import type { ProductType, QuoteStatus } from './common';

export interface Quote {
  id: string;
  number: string;
  productType: ProductType;
  productName: string;
  createdAt: string;
  premium: number;
  currency: 'MXN';
  status: QuoteStatus;
  customerName: string;
  riskObjectName: string;
  ongoingIssuanceId?: string;
}

