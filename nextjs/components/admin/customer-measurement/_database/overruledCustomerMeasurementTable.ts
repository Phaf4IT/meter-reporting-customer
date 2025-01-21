import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import OverruledCustomerMeasurement from "@/components/database/schemas/public/OverruledCustomerMeasurement";

@EntityClass("overruled_customer_measurement")
export class OverruledCustomerMeasurementTable extends Entity implements OverruledCustomerMeasurement {
    @PrimaryKey
    @Field("campaign_name")
    campaignName: string;

    @PrimaryKey
    @Field("customer_id")
    customerId: string;

    @Field("customer_mail")
    customerMail: string;

    @PrimaryKey
    @Field()
    company: string;

    @Field()
    measurements: any[];

    @Field("original_date_time")
    originalDateTime: Date;

    @PrimaryKey
    @Field("overrule_date_time")
    overruleDateTime: Date;

    constructor(
        campaignName: string,
        customerId: string,
        customerMail: string,
        company: string,
        measurements: any[],
        originalDateTime: Date | string,
        overruleDateTime: Date | string
    ) {
        super();
        this.campaignName = campaignName;
        this.customerId = customerId;
        this.customerMail = customerMail;
        this.company = company;
        this.measurements = measurements;
        this.originalDateTime = new Date(originalDateTime);
        this.overruleDateTime = new Date(overruleDateTime);
    }

    static of({
                  campaignName,
                  customerId,
                  customerMail,
                  company,
                  measurements,
                  overruleDateTime,
                  originalDateTime
              }: OverruledCustomerMeasurement) {
        return new OverruledCustomerMeasurementTable(
            campaignName,
            customerId,
            customerMail,
            company,
            measurements,
            originalDateTime,
            overruleDateTime);
    }
}
