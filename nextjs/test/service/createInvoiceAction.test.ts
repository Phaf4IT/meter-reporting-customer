import {expect} from 'chai';
import {Campaign, CampaignType} from "@/components/admin/campaign/campaign";
import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";
import {Tariff, Unit} from "@/components/admin/tariff/tariff";
import {createInvoice} from "@/components/admin/invoice/action/createInvoiceAction";
import {Status, Type} from "@/components/admin/invoice/invoice";
import {MeasureValueType} from "@/components/admin/measure-value/measureValue";

describe('createInvoice', () => {
    it('should create an invoice with correct total amount and all underlying methods working', () => {
        const mockCustomerId = 'customer1';
        const campaignName = 'Campaign 1';
        // Mockdata
        const mockCampaign: Campaign = {
            name: campaignName,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            customers: [],
            type: CampaignType.PERIODIC,
            configurationName: 'cfName',
            reminderDates: [],
            measureValues: [
                {
                    name: 'Measure 1',
                    type: MeasureValueType.NUMBER_RANGE,
                    unit: 'm3',
                    isEditable: true,
                    translations: []
                },
                {name: 'Measure 2', type: MeasureValueType.NUMBER_RANGE, unit: 'm3', isEditable: true, translations: []}
            ]
        };

        const mockPreviousCustomerMeasurement: CustomerMeasurement = {
            customerId: mockCustomerId,
            campaignName,
            customerMail: 'customerMail@mail.com',
            dateTime: new Date(),
            measurements: [
                {name: 'Measure 1', value: '10'},
                {name: 'Measure 2', value: '100'}
            ]
        };

        const mockCustomerMeasurement: CustomerMeasurement = {
            customerId: mockCustomerId,
            campaignName,
            customerMail: 'customerMail@mail.com',
            dateTime: new Date(),
            measurements: [
                {name: 'Measure 1', value: '15'},
                {name: 'Measure 2', value: '120'}
            ]
        };

        const mockTariffs: Tariff[] = [
            {
                measureValueName: 'Measure 1',
                rate: 5,
                unit: Unit.usage_based,
                currency: 'EUR',
                customerIds: ['customer1'],
                id: 'tariff1',
                description: 'Tariff 1',
                campaignName,
                validFrom: new Date()
            },
            {
                measureValueName: 'Measure 2',
                rate: 10,
                unit: Unit.usage_based,
                currency: 'EUR',
                customerIds: ['customer1'],
                id: 'tariff2',
                description: 'Tariff 2',
                campaignName,
                validFrom: new Date()
            },
            {
                rate: 100,
                unit: Unit.monthly,
                currency: 'EUR',
                customerIds: ['customer1'],
                id: 'tariff3',
                description: 'Monthly Tariff',
                measureValueName: '',
                campaignName,
                validFrom: new Date()
            },
            {
                rate: 1200,
                unit: Unit.annual,
                currency: 'EUR',
                customerIds: ['customer1'],
                id: 'tariff4',
                description: 'Annual Tariff',
                measureValueName: '',
                campaignName,
                validFrom: new Date()
            }
        ];

        const mockCompany = 'Company 1';
        const mockDate = new Date('2024-02-01');

        // Roep de createInvoice functie aan
        const {
            invoiceLines,
            invoice
        } = createInvoice(mockCampaign, mockPreviousCustomerMeasurement, mockCustomerMeasurement, mockTariffs, mockCustomerId, mockCompany, mockDate);

        // Controleer de factuurresultaten
        expect(invoice.totalAmount).to.be.a('number').that.is.greaterThan(0); // Controleer of het totaalbedrag positief is
        expect(invoice.customerId).to.equal(mockCustomerId);
        expect(invoice.company).to.equal(mockCompany);
        expect(invoice.campaignName).to.equal(mockCampaign.name);
        expect(invoice.currency).to.equal('EUR');
        expect(invoice.status).to.equal(Status.PENDING);
        expect(invoice.type).to.equal(Type.REGULAR);

        // Controleer de resultaten van de berekeningen in invoiceLines
        expect(invoiceLines).to.be.an('array').that.is.not.empty; // Zorg ervoor dat er factureregels zijn

        // Controleer de berekeningen van de meettarieven (op basis van de mockdata)
        const invoiceLine1 = invoiceLines.find(line => line.tariffId === 'tariff1');
        const invoiceLine2 = invoiceLines.find(line => line.tariffId === 'tariff2');
        expect(invoiceLine1).to.exist; // Controleer of het juiste tarief werd toegevoegd
        expect(invoiceLine2).to.exist;

        // Controleer de juiste berekeningen van de meettarieven
        expect(invoiceLine1?.lineTotal).to.equal(25);  // Tarief 1: 5 * (15 - 10)
        expect(invoiceLine2?.lineTotal).to.equal(200); // Tarief 2: 10 * (120 - 100)

        // Controleer de berekeningen van de generieke tarieven
        const genericTariffInvoiceLine1 = invoiceLines.find(line => line.tariffId === 'tariff3');
        const genericTariffInvoiceLine2 = invoiceLines.find(line => line.tariffId === 'tariff4');
        expect(genericTariffInvoiceLine1).to.exist; // Maandtarief
        expect(genericTariffInvoiceLine2).to.exist; // Jaarlijks tarief

        // Controleer de juiste berekeningen voor maand- en jaartarief
        expect(genericTariffInvoiceLine1?.lineTotal).to.equal(100 * 12); // Tarief 3: 100 per maand voor 12 maanden
        expect(genericTariffInvoiceLine2?.lineTotal).to.equal(1200); // Tarief 4: 1200 per jaar
    });

    it('should correctly handle decimal rates in monthly tariffs', () => {
        const customerId = 'customer_123';
        const campaignName = 'Campaign 1';

        // Test data setup
        const campaign: Campaign = {
            name: campaignName,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            customers: [],
            type: CampaignType.PERIODIC,
            configurationName: 'cfName',
            reminderDates: [],
            measureValues: [
                {
                    name: 'test_measure_1',
                    type: MeasureValueType.NUMBER_RANGE,
                    translations: [],
                    isEditable: true,
                    unit: ''
                }
            ]
        };

        const previousCustomerMeasurement: CustomerMeasurement = {
            customerId: customerId,
            campaignName,
            customerMail: 'customerMail@mail.com',
            dateTime: new Date(),
            measurements: [{name: 'test_measure_1', value: '10'}]
        };

        const customerMeasurement: CustomerMeasurement = {
            customerId: customerId,
            campaignName,
            customerMail: 'customerMail@mail.com',
            dateTime: new Date(),
            measurements: [{name: 'test_measure_1', value: '20'}]
        };

        const tariffs: Tariff[] = [
            {
                campaignName,
                id: '1',
                measureValueName: '',
                rate: 49.99, // Decimaal tarief per maand
                unit: Unit.monthly,
                currency: 'EUR',
                customerIds: [customerId],
                description: 'Test monthly tariff for customer_123',
                validFrom: new Date()
            }
        ];

        const company = 'Test Company';
        const date = new Date('2024-01-01');

        // Function call
        const {invoiceLines, invoice} = createInvoice(
            campaign,
            previousCustomerMeasurement,
            customerMeasurement,
            tariffs,
            customerId,
            company,
            date
        );

        // Assertions
        expect(invoice.totalAmount).to.equal(49.99 * 12); // 49.99 EUR per maand voor 12 maanden
        expect(invoiceLines.length).to.equal(1); // Alleen het tarief voor customer_123 wordt toegepast

        const tariffLine = invoiceLines[0];
        expect(tariffLine.lineTotal).to.equal(49.99 * 12); // 49.99 EUR per maand voor 12 maanden
        expect(tariffLine.unitPrice).to.equal(49.99); // Het tarief per maand moet 49.99 zijn
        expect(tariffLine.quantity).to.equal(12); // Er zijn 12 maanden in de campagne
        expect(tariffLine.description).to.equal('Test monthly tariff for customer_123'); // Beschrijving moet overeenkomen
    });

    it('should ignore tariffs not applicable to the customer', () => {
        const customerId = 'customer_123';
        const campaignName = 'Campaign 1';
        // Test data setup
        const campaign: Campaign = {
            name: campaignName,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            customers: [],
            type: CampaignType.PERIODIC,
            configurationName: 'cfName',
            reminderDates: [],
            measureValues: [
                {
                    name: 'test_measure_1',
                    type: MeasureValueType.NUMBER_RANGE,
                    translations: [],
                    isEditable: true,
                    unit: ''
                }
            ]
        };

        const previousCustomerMeasurement: CustomerMeasurement = {
            customerId: customerId,
            campaignName,
            customerMail: 'customerMail@mail.com',
            dateTime: new Date(),
            measurements: [{name: 'test_measure_1', value: '10'}]
        };

        const customerMeasurement: CustomerMeasurement = {
            customerId: customerId,
            campaignName,
            customerMail: 'customerMail@mail.com',
            dateTime: new Date(),
            measurements: [{name: 'test_measure_1', value: '20'}]
        };

        const tariffs: Tariff[] = [
            {
                campaignName,
                validFrom: new Date(),
                id: '1',
                measureValueName: '',
                rate: 49.99, // Tarief voor klant met customer_123
                unit: Unit.monthly,
                currency: 'EUR',
                customerIds: [customerId],
                description: 'Test monthly tariff for customer_123'
            },
            {
                campaignName,
                validFrom: new Date(),
                id: '2',
                measureValueName: '',
                rate: 30.00, // Tarief voor alle klanten, maar geen klant-ID, dus genegeerd
                unit: Unit.monthly,
                currency: 'EUR',
                customerIds: [],
                description: 'Generic monthly tariff (ignored)'
            }
        ];

        const company = 'Test Company';
        const date = new Date('2024-01-01');

        // Function call
        const {invoiceLines, invoice} = createInvoice(
            campaign,
            previousCustomerMeasurement,
            customerMeasurement,
            tariffs,
            customerId,
            company,
            date
        );

        // Assertions
        expect(invoice.totalAmount).to.equal(49.99 * 12); // Alleen het tarief voor customer_123 wordt toegepast
        expect(invoiceLines.length).to.equal(1); // Alleen het tarief voor customer_123 wordt toegevoegd

        const tariffLine = invoiceLines[0];
        expect(tariffLine.lineTotal).to.equal(49.99 * 12); // 49.99 EUR per maand voor 12 maanden
        expect(tariffLine.unitPrice).to.equal(49.99); // Het tarief per maand moet 49.99 zijn
        expect(tariffLine.quantity).to.equal(12); // Er zijn 12 maanden in de campagne
        expect(tariffLine.description).to.equal('Test monthly tariff for customer_123'); // Beschrijving moet overeenkomen

        // Test of het genegeerde tarief inderdaad niet in de factuurregels staat
        const ignoredTariffLine = invoiceLines.find(line => line.description === 'Generic monthly tariff (ignored)');
        expect(ignoredTariffLine).to.be.undefined; // Dit tarief wordt genegeerd en moet dus niet voorkomen
    });
});
