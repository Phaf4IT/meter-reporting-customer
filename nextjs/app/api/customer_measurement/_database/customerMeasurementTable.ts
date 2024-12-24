import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";

@EntityClass("customer_measurement")
export class CustomerMeasurementTable extends Entity {
    @PrimaryKey
    @Field("campaign_name")
    campaignName: string;

    @PrimaryKey
    @Field("customer_mail")
    customerMail: string;

    @PrimaryKey
    @Field()
    company: string;

    @Field()
    measurements: any[];

    @Field("date_time")
    dateTime: Date;

    constructor(
        campaignName: string,
        customerMail: string,
        company: string,
        measurements: any[],
        dateTime: Date | string
    ) {
        super();
        this.campaignName = campaignName;
        this.customerMail = customerMail;
        this.company = company;
        this.measurements = measurements;
        this.dateTime = new Date(dateTime);
    }
}
