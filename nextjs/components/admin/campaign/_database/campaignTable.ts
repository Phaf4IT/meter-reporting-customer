import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import Campaign from "@/components/database/schemas/public/Campaign";

@EntityClass("campaign")
export class CampaignTable extends Entity implements Campaign {
    @PrimaryKey
    @Field()
    name: string;
    @Field("start_date")
    startDate: Date;
    @Field("end_date")
    endDate: Date;
    @Field("reminder_dates")
    reminderDates: Date[];
    @Field("customer_ids")
    customerIds: string[];
    @Field("measure_values")
    measureValues: any[];
    @PrimaryKey
    @Field()
    company: string;

    constructor(name: string,
                start_date: Date | string,
                end_date: Date | string,
                reminder_dates: Date[],
                customerIds: string[],
                measure_values: Record<any, any>[],
                company: string) {
        super();
        this.name = name;
        this.startDate = new Date(start_date);
        this.endDate = new Date(end_date);
        this.reminderDates = reminder_dates?.map(value => new Date(value));
        this.customerIds = customerIds;
        this.measureValues = measure_values;
        this.company = company;
    }
}