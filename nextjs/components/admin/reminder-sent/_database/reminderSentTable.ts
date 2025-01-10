import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import CampaignReminderSent from "@/components/database/schemas/public/CampaignReminderSent";

@EntityClass("campaign_reminder_sent")
export class ReminderSentTable extends Entity implements CampaignReminderSent {
    @PrimaryKey
    @Field("campaign_name")
    campaignName: string;
    @PrimaryKey
    @Field("reminder_date")
    reminderDate: Date;
    @PrimaryKey
    @Field("customer_email")
    customerEmail: string;
    @PrimaryKey
    @Field("token")
    token: string;
    @PrimaryKey
    @Field()
    company: string;

    constructor(campaignName: string,
                customerEmail: string,
                token: string,
                reminderDate: Date,
                company: string) {
        super();
        this.campaignName = campaignName;
        this.customerEmail = customerEmail;
        this.token = token;
        this.reminderDate = new Date(reminderDate);
        this.company = company;
    }
}