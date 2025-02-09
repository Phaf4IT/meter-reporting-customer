import {Tariff, Unit} from "@/components/admin/tariff/tariff";
import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";
import {Campaign} from "@/components/admin/campaign/campaign";
import {MeasureValueType} from "@/components/admin/measure-value/measureValue";
import {Invoice, InvoiceLineItem, Status, Type} from "@/components/admin/invoice/invoice";
import {saveInvoice} from "@/components/admin/invoice/_database/invoiceRepository";


export async function createInvoiceAction(tariffs: Tariff[],
                                          customerId: string,
                                          customerMeasurement: CustomerMeasurement,
                                          previousCustomerMeasurement: CustomerMeasurement,
                                          campaign: Campaign,
                                          company: string) {
    const {
        invoiceLines,
        invoice
    } = createInvoice(campaign, previousCustomerMeasurement, customerMeasurement, tariffs, customerId, company, new Date());
    const createdInvoice = await saveInvoice(invoice);
    invoiceLines.map(value => value.invoiceId = createdInvoice.id)
}

interface InvoiceLinesResult {
    invoiceLines: InvoiceLineItem[];
    totalAmount: number;
}

interface InvoiceResult {
    invoiceLines: InvoiceLineItem[];
    invoice: Invoice;
}

export function createInvoice(campaign: Campaign,
                              previousCustomerMeasurement: CustomerMeasurement,
                              customerMeasurement: CustomerMeasurement,
                              tariffs: Tariff[],
                              customerId: string,
                              company: string,
                              date: Date): InvoiceResult {
    // TODO
    const currency = 'EUR';
    const tariffsMeasurementsResult: InvoiceLinesResult = calculateMeasurementTariffs(
        campaign,
        previousCustomerMeasurement,
        customerMeasurement,
        tariffs,
        customerId,
        company,
        date);

    const tariffsGenericResult: InvoiceLinesResult = calculateGenericTariffs(
        campaign,
        tariffs,
        date,
        customerId,
        company
    );


    const invoice: Invoice = {
        id: '',
        sequenceNumber: '',
        year: date.getFullYear(),
        customerId: customerId,
        company: company,
        campaignName: campaign.name,
        invoiceDate: date,
        totalAmount: tariffsMeasurementsResult.totalAmount + tariffsGenericResult.totalAmount,
        currency: currency,
        status: Status.PENDING,
        type: Type.REGULAR
    }
    return {invoiceLines: [...tariffsMeasurementsResult.invoiceLines, ...tariffsGenericResult.invoiceLines], invoice};
}

function calculateMeasurementTariffs(campaign: Campaign,
                                     previousCustomerMeasurement: CustomerMeasurement,
                                     customerMeasurement: CustomerMeasurement,
                                     tariffs: Tariff[],
                                     customerId: string,
                                     company: string,
                                     date: Date): InvoiceLinesResult {
    let totalAmount = 0;
    const invoiceLines: InvoiceLineItem[] = [];
    for (const measureValue of campaign.measureValues) {
        if (measureValue.type === MeasureValueType.NUMBER_RANGE) {
            const previousMeasurement = previousCustomerMeasurement.measurements.find(m => m.name === measureValue.name)!;
            const currentMeasurement = customerMeasurement.measurements.find(m => m.name === measureValue.name)!;
            const measurementTariffs = tariffs
                .filter(value =>
                    value.measureValueName === measureValue.name &&
                    value.customerIds.filter(value => value === customerId).find(() => true));
            const difference = Number.parseFloat(currentMeasurement.value) - Number.parseFloat(previousMeasurement.value);
            for (const measurementTariff of measurementTariffs) {
                if (measurementTariff.unit === Unit.usage_based) {
                    const invoiceLine: InvoiceLineItem = {
                        id: '',
                        invoiceId: '',
                        lineTotal: measurementTariff.rate * difference,
                        unitPrice: measurementTariff.rate,
                        campaignName: campaign.name,
                        invoiceDate: date,
                        currency: measurementTariff.currency,
                        customerId: customerId,
                        company,
                        tariffId: measurementTariff.id,
                        description: measurementTariff.description,
                        quantity: difference
                    }
                    totalAmount += invoiceLine.lineTotal;
                    invoiceLines.push(invoiceLine);
                }
            }
        } else if (measureValue.type === MeasureValueType.NUMBER) {
            const currentMeasurement = customerMeasurement.measurements.find(m => m.name === measureValue.name)!;
            const measurementTariffs = tariffs
                .filter(value =>
                    value.measureValueName === measureValue.name &&
                    value.customerIds.filter(value => value === customerId).find(() => true));
            const quantity = Number.parseFloat(currentMeasurement.value);
            for (const measurementTariff of measurementTariffs) {
                if (measurementTariff.unit === Unit.usage_based) {
                    const invoiceLine: InvoiceLineItem = {
                        id: '',
                        invoiceId: '',
                        lineTotal: measurementTariff.rate * quantity,
                        unitPrice: measurementTariff.rate,
                        campaignName: campaign.name,
                        invoiceDate: date,
                        currency: measurementTariff.currency,
                        customerId: customerId,
                        company,
                        tariffId: measurementTariff.id,
                        description: measurementTariff.description,
                        quantity
                    }
                    totalAmount += invoiceLine.lineTotal;
                    invoiceLines.push(invoiceLine);
                }
            }
        }
    }
    return {
        invoiceLines: invoiceLines,
        totalAmount: totalAmount
    }
}

function calculateGenericTariffs(campaign: Campaign, tariffs: Tariff[], date: Date, customerId: string, company: string): InvoiceLinesResult {
    let totalAmount = 0;
    const invoiceLines: InvoiceLineItem[] = [];
    for (const regularTariff of tariffs.filter(value => value.unit !== Unit.usage_based && value.customerIds.find(id => customerId === id))) {
        if (regularTariff.unit === Unit.annual) {
            const totalYears = period(campaign.startDate, campaign.endDate, 'years');
            const invoiceLine: InvoiceLineItem = {
                id: '',
                invoiceId: '',
                lineTotal: regularTariff.rate * totalYears,
                unitPrice: regularTariff.rate,
                campaignName: campaign.name,
                invoiceDate: date,
                currency: regularTariff.currency,
                customerId: customerId,
                company,
                tariffId: regularTariff.id,
                description: regularTariff.description,
                quantity: totalYears
            };
            totalAmount += invoiceLine.lineTotal;
            invoiceLines.push(invoiceLine);
        } else if (regularTariff.unit === Unit.monthly) {
            const totalMonths = period(campaign.startDate, campaign.endDate, 'months');
            const invoiceLine: InvoiceLineItem = {
                id: '',
                invoiceId: '',
                lineTotal: regularTariff.rate * totalMonths,
                unitPrice: regularTariff.rate,
                campaignName: campaign.name,
                invoiceDate: date,
                currency: regularTariff.currency,
                customerId: customerId,
                company,
                tariffId: regularTariff.id,
                description: regularTariff.description,
                quantity: totalMonths
            };
            totalAmount += invoiceLine.lineTotal;
            invoiceLines.push(invoiceLine);
        } else if (regularTariff.unit === Unit.daily) {
            const totalDays = period(campaign.startDate, campaign.endDate, 'days');
            const invoiceLine: InvoiceLineItem = {
                id: '',
                invoiceId: '',
                lineTotal: regularTariff.rate * totalDays,
                unitPrice: regularTariff.rate,
                campaignName: campaign.name,
                invoiceDate: date,
                currency: regularTariff.currency,
                customerId: customerId,
                company,
                tariffId: regularTariff.id,
                description: regularTariff.description,
                quantity: totalDays
            };
            totalAmount += invoiceLine.lineTotal;
            invoiceLines.push(invoiceLine);
        }
    }
    return {
        invoiceLines: invoiceLines,
        totalAmount: totalAmount
    }
}

function period(date1: Date, date2: Date, unit: 'months' | 'days' | 'years'): number {
    const timeInMillisec1 = date1.getTime();
    const timeInMillisec2 = date2.getTime();
    const diffInMillisec = Math.abs(timeInMillisec2 - timeInMillisec1);

    switch (unit) {
        case 'months':
            const yearDiff = date2.getFullYear() - date1.getFullYear();
            const monthDiff = date2.getMonth() - date1.getMonth();
            return yearDiff * 12 + monthDiff + (date2.getDate() >= date1.getDate() ? 1 : 0);

        case 'days':
            return Math.floor(diffInMillisec / (1000 * 60 * 60 * 24));

        case 'years':
            const diffInYears = diffInMillisec / (1000 * 60 * 60 * 24 * 365.25);
            return Math.ceil(diffInYears);

        default:
            throw new Error('Ongeldige eenheid');
    }
}