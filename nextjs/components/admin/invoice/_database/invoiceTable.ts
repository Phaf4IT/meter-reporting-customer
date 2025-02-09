// invoiceTable.ts
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import {Entity} from "@/lib/jpa/entity";
import Invoice from "@/components/database/schemas/public/Invoice";

@EntityClass("invoice")
export class InvoiceTable extends Entity implements Invoice {
    @PrimaryKey
    @Field('id', true)
    id: string;

    @Field("sequence_number", true)
    sequenceNumber: string;

    @Field('year')
    year: number;

    @Field("customer_id")
    customerId: string;

    @Field()
    company: string;

    @Field("campaign_name")
    campaignName: string;

    @Field("invoice_date")
    invoiceDate: Date;

    @Field("total_amount")
    totalAmount: string;

    @Field()
    currency: string;

    @Field()
    status: string//'PENDING' | 'PAID' | 'CANCELLED';

    @Field()
    type: string//'REGULAR' | 'CREDITNOTA';

    @Field("original_invoice_id")
    originalInvoiceId: string | null;

    constructor(id: string, sequenceNumber: string, year: number, customerId: string, company: string, campaignName: string, invoiceDate: Date, totalAmount: string, currency: string, status: string, type: string, originalInvoiceId?: string) {
        super();
        this.id = id;
        this.sequenceNumber = sequenceNumber;
        this.year = year;
        this.customerId = customerId;
        this.company = company;
        this.campaignName = campaignName;
        this.invoiceDate = invoiceDate;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.status = status;
        this.type = type;
        this.originalInvoiceId = originalInvoiceId || null;
    }

    static of({
                  id,
                  sequenceNumber,
                  year,
                  customerId,
                  company,
                  campaignName,
                  invoiceDate,
                  totalAmount,
                  currency,
                  status,
                  type,
                  originalInvoiceId
              }: Invoice): InvoiceTable {
        return new InvoiceTable(id, sequenceNumber, year, customerId, company, campaignName, invoiceDate, totalAmount, currency, status, type, originalInvoiceId || undefined);
    }
}
