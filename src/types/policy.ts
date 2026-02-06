export interface Policy {
  id: string;
  quoteId: string;
  policyNumber: string;
  productName: string;
  insuredName: string;
  effectiveDate: string;
  expiryDate: string;
  pdfUrl: string;
  emailSent: boolean;
  notificationEmail?: string;
}
