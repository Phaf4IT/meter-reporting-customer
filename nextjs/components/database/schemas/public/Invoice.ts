// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.invoice */
export type InvoiceId = string;

/** Represents the table public.invoice */
export default interface Invoice {
  id: InvoiceId;

  sequenceNumber: string;

  year: number;

  customerId: string;

  company: string;

  campaignName: string;

  invoiceDate: Date;

  totalAmount: string;

  currency: string;

  status: string;

  type: string;

  originalInvoiceId: InvoiceId | null;
}

/** Represents the initializer for the table public.invoice */
export interface InvoiceInitializer {
  /** Default value: uuidv7_sub_ms() */
  id?: InvoiceId;

  sequenceNumber: string;

  year: number;

  customerId: string;

  company: string;

  campaignName: string;

  /** Default value: now() */
  invoiceDate?: Date;

  totalAmount: string;

  currency: string;

  status: string;

  type: string;

  originalInvoiceId?: InvoiceId | null;
}

/** Represents the mutator for the table public.invoice */
export interface InvoiceMutator {
  id?: InvoiceId;

  sequenceNumber?: string;

  year?: number;

  customerId?: string;

  company?: string;

  campaignName?: string;

  invoiceDate?: Date;

  totalAmount?: string;

  currency?: string;

  status?: string;

  type?: string;

  originalInvoiceId?: InvoiceId | null;
}
