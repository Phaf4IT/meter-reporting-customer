import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import type Reminder from "@/components/database/schemas/public/Reminder";

@EntityClass("reminder")
export class ReminderTable extends Entity implements Reminder {
    @PrimaryKey
    @Field("campaign_name")
    campaignName: string;
    @PrimaryKey
    @Field("reminder_date")
    reminderDate: Date;
    @Field("customer_ids")
    customerIds: string[];
    @PrimaryKey
    @Field()
    company: string;

    constructor(campaignName: string,
                customerIds: string[],
                reminderDate: Date,
                company: string
    ) {
        super();
        this.campaignName = campaignName;
        this.customerIds = customerIds;
        this.reminderDate = new Date(reminderDate);
        this.company = company;
    }

    static ofReminderTable({
                               campaignName,
                               customerIds,
                               reminderDate,
                               company
                           }: Reminder) {
        return new ReminderTable(campaignName, customerIds, reminderDate, company);
    }
}