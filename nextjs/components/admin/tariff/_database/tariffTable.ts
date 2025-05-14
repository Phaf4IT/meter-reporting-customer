// tariffTable.ts
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import {Entity as E} from "@/lib/jpa/entity";
import Tariff from "@/components/database/schemas/public/Tariff"; // De daadwerkelijke tabel `Tariff` schema

@EntityClass("tariff")
export class TariffTable extends E implements Tariff {
    @PrimaryKey
    @Field('id', true)
    id: string;

    @Field("campaign_name")
    campaignName: string;

    @Field("company")
    company: string;

    @Field("measure_value_name")
    measureValueName: string | null;

    @Field("range_from")
    rangeFrom: string | null;

    @Field("valid_from")
    validFrom: Date;

    @Field("customer_ids")
    customerIds: string[];

    @Field("description")
    description: string;

    @Field("rate")
    rate: string;

    @Field("currency")
    currency: string;

    @Field("unit")
    unit: string;

    @Field("range_to")
    rangeTo: string | null;

    @Field("valid_to")
    validTo: Date | null;

    @Field("is_deposit")
    isDeposit: boolean;

    constructor(
        id: string,
        campaignName: string,
        company: string,
        measureValueName: string | null,
        rangeFrom: string | null,
        validFrom: Date,
        customerIds: string[],
        description: string,
        rate: string,
        currency: string,
        unit: string,
        rangeTo: string | null,
        validTo: Date | null,
        isDeposit: boolean
    ) {
        super();
        this.id = id;
        this.campaignName = campaignName;
        this.company = company;
        this.measureValueName = measureValueName;
        this.rangeFrom = rangeFrom;
        this.validFrom = new Date(validFrom);
        this.customerIds = customerIds;
        this.description = description;
        this.rate = rate;
        this.currency = currency;
        this.unit = unit;
        this.rangeTo = rangeTo;
        this.validTo = validTo ? new Date(validTo) : null;
        this.isDeposit = isDeposit;
    }

    static of(tariff: Tariff): TariffTable {
        return new TariffTable(
            tariff.id,
            tariff.campaignName,
            tariff.company,
            tariff.measureValueName,
            tariff.rangeFrom,
            tariff.validFrom,
            tariff.customerIds,
            tariff.description,
            tariff.rate,
            tariff.currency,
            tariff.unit,
            tariff.rangeTo,
            tariff.validTo,
            tariff.isDeposit
        );
    }
}
