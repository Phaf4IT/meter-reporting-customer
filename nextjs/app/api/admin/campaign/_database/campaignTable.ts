import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";

@EntityClass("campaign")
export class CampaignTable extends Entity {
    @PrimaryKey
    @Field()
    start_date: Date;
    @PrimaryKey
    @Field()
    end_date: Date;
    @Field()
    reminder_dates: Date[];
    @Field()
    customer_emails: string[];
    @Field()
    measure_values: any[];
    @PrimaryKey
    @Field()
    company: string;

    constructor(start_date: Date | string,
                end_date: Date | string,
                reminder_dates: Date[],
                customer_emails: string[],
                measure_values: Record<any, any>[],
                company: string) {
        super();
        this.start_date = new Date(start_date);
        this.end_date = new Date(end_date);
        this.reminder_dates = reminder_dates?.map(value => new Date(value));
        this.customer_emails = customer_emails;
        this.measure_values = measure_values;
        this.company = company;
    }
}