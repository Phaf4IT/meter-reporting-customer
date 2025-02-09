// invoiceRepository.ts
import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {InvoiceTable} from "@/components/admin/invoice/_database/invoiceTable";
import {getStatus, getType, Invoice} from "@/components/admin/invoice/invoice";

export async function findInvoicesByCompany(company: string) {
    return getEntityManager(InvoiceTable)
        .findBy({company})
        .then(invoices => invoices.map(invoice => mapTableToDomain(invoice)));
}

export async function findInvoiceById(id: string): Promise<Invoice | undefined> {
    return getEntityManager(InvoiceTable)
        .findBy({id})
        .then(invoices => invoices.map(invoice => mapTableToDomain(invoice)).find(() => true));
}

export async function saveInvoice(invoice: Invoice) {
    return getEntityManager(InvoiceTable)
        .create(mapDomainToTable(invoice))
        .then(invoice => mapTableToDomain(invoice));
}

export async function updateInvoice(invoice: Invoice) {
    return getEntityManager(InvoiceTable)
        .update(mapDomainToTable(invoice))
        .then(() => invoice);
}

function mapTableToDomain(invoice: InvoiceTable): Invoice {
    return {
        id: invoice.id,
        sequenceNumber: invoice.sequenceNumber,
        year: invoice.year,
        customerId: invoice.customerId,
        company: invoice.company,
        campaignName: invoice.campaignName,
        invoiceDate: invoice.invoiceDate,
        totalAmount: Number.parseFloat(invoice.totalAmount),
        currency: invoice.currency,
        status: getStatus(invoice.status),
        type: getType(invoice.type),
        originalInvoiceId: invoice.originalInvoiceId || undefined,
    };
}

function mapDomainToTable(invoice: Invoice): InvoiceTable {
    return InvoiceTable.of({
        id: invoice.id,
        sequenceNumber: invoice.sequenceNumber,
        year: invoice.year,
        customerId: invoice.customerId,
        company: invoice.company,
        campaignName: invoice.campaignName,
        invoiceDate: invoice.invoiceDate,
        totalAmount: invoice.totalAmount.toFixed(2),
        currency: invoice.currency,
        status: invoice.status,
        type: invoice.type,
        originalInvoiceId: invoice.originalInvoiceId || null,
    });
}
