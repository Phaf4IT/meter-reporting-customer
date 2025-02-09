// invoice.ts
export interface Invoice {
    id: string;
    sequenceNumber: string;
    year: number;
    customerId: string;
    company: string;
    campaignName: string;
    invoiceDate: Date;
    totalAmount: number;
    currency: string;
    status: Status;
    type: Type;
    originalInvoiceId?: string;
}

export enum Status {
    PENDING = 'PENDING', PAID = 'PAID', CANCELLED = 'CANCELLED'
}

export function getStatus(type: string): Status {
    return Status[type as keyof typeof Status];
}

export enum Type {
    REGULAR = 'REGULAR', CREDITNOTA = 'CREDITNOTA'
}

export function getType(type: string): Type {
    return Type[type as keyof typeof Type];
}

export interface InvoiceLineItem {
    id: string;
    invoiceId: string;
    customerId: string;
    company: string;
    invoiceDate: Date;
    campaignName: string;
    tariffId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    currency: string;
}
