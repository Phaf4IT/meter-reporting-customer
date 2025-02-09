// invoiceLineItemTable.ts
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import {Entity} from "@/lib/jpa/entity";
import InvoiceLineItem from "@/components/database/schemas/public/InvoiceLineItem";

@EntityClass("invoice_line_item")
export class InvoiceLineItemTable extends Entity implements InvoiceLineItem {
    @PrimaryKey
    @Field()
    id: string;

    @Field("invoice_id")
    invoiceId: string;

    @Field("customer_id")
    customerId: string;

    @Field()
    company: string;

    @Field("invoice_date")
    invoiceDate: Date;

    @Field("campaign_name")
    campaignName: string;

    @Field("tariff_id")
    tariffId: string;

    @Field()
    description: string;

    @Field()
    quantity: string;

    @Field("unit_price")
    unitPrice: string;

    @Field("line_total")
    lineTotal: string;

    @Field()
    currency: string;

    constructor(id: string,
                invoiceId: string,
                customerId: string,
                company: string,
                invoiceDate: Date,
                campaignName: string,
                tariffId: string,
                description: string,
                quantity: string,
                unitPrice: string,
                lineTotal: string,
                currency: string) {
        super();
        this.id = id;
        this.invoiceId = invoiceId;
        this.customerId = customerId;
        this.company = company;
        this.invoiceDate = invoiceDate;
        this.campaignName = campaignName;
        this.tariffId = tariffId;
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
        this.currency = currency;
    }

    static of({
                  id,
                  invoiceId,
                  customerId,
                  company,
                  invoiceDate,
                  campaignName,
                  tariffId,
                  description,
                  quantity,
                  unitPrice,
                  lineTotal,
                  currency
              }: InvoiceLineItem): InvoiceLineItemTable {
        return new InvoiceLineItemTable(id, invoiceId, customerId, company, invoiceDate, campaignName, tariffId, description, quantity, unitPrice, lineTotal, currency);
    }
}
