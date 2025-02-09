// invoiceLineItemRepository.ts
import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {InvoiceLineItemTable} from "@/components/admin/invoice/_database/invoiceLineItemTable";
import {InvoiceLineItem} from "@/components/admin/invoice/invoice";

export async function findInvoiceLineItemsByInvoiceId(invoice_id: string) {
    return getEntityManager(InvoiceLineItemTable)
        .findBy({invoice_id})
        .then(lineItems => lineItems.map(item => mapTableToDomain(item)));
}

export async function saveInvoiceLineItem(lineItem: InvoiceLineItem) {
    return getEntityManager(InvoiceLineItemTable)
        .create(mapDomainToTable(lineItem))
        .then(item => mapTableToDomain(item));
}

export async function saveInvoiceLineItems(lineItems: InvoiceLineItem[]) {
    return getEntityManager(InvoiceLineItemTable)
        .createAll(lineItems.map(mapDomainToTable))
        .then(items => items.map(mapTableToDomain));
}

export async function updateInvoiceLineItem(lineItem: InvoiceLineItem) {
    return getEntityManager(InvoiceLineItemTable)
        .update(mapDomainToTable(lineItem))
        .then(() => lineItem);
}

function mapTableToDomain(lineItem: InvoiceLineItemTable): InvoiceLineItem {
    return {
        id: lineItem.id,
        invoiceId: lineItem.invoiceId,
        customerId: lineItem.customerId,
        company: lineItem.company,
        invoiceDate: lineItem.invoiceDate,
        campaignName: lineItem.campaignName,
        tariffId: lineItem.tariffId,
        description: lineItem.description,
        quantity: Number.parseFloat(lineItem.quantity),
        unitPrice: Number.parseFloat(lineItem.unitPrice),
        lineTotal: Number.parseFloat(lineItem.lineTotal),
        currency: lineItem.currency,
    };
}

function mapDomainToTable(lineItem: InvoiceLineItem): InvoiceLineItemTable {
    return InvoiceLineItemTable.of({
        id: lineItem.id,
        invoiceId: lineItem.invoiceId,
        customerId: lineItem.customerId,
        company: lineItem.company,
        invoiceDate: lineItem.invoiceDate,
        campaignName: lineItem.campaignName,
        tariffId: lineItem.tariffId,
        description: lineItem.description,
        quantity: lineItem.quantity.toFixed(2),
        unitPrice: lineItem.unitPrice.toFixed(2),
        lineTotal: lineItem.lineTotal.toFixed(2),
        currency: lineItem.currency,
    });
}
