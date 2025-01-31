import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import Campaign from "@/components/database/schemas/public/Campaign";
import {CampaignType, getCampaignType} from "@/components/admin/campaign/campaign";

@EntityClass("campaign")
export class CampaignTable extends Entity implements Campaign {
    @PrimaryKey
    @Field()
    name: string;
    @Field("campaign_configuration_name")
    campaignConfigurationName: string;
    @Field()
    type: CampaignType;
    @Field("start_date")
    startDate: Date;
    @Field("end_date")
    endDate: Date;
    @Field("reminder_dates")
    reminderDates: Date[];
    @Field("customer_ids")
    customerIds: string[];
    @PrimaryKey
    @Field()
    company: string;

    constructor(name: string,
                campaignConfigurationName: string,
                type: CampaignType,
                start_date: Date | string,
                end_date: Date | string,
                reminder_dates: Date[],
                customerIds: string[],
                company: string) {
        super();
        this.name = name;
        this.campaignConfigurationName = campaignConfigurationName;
        this.type = type;
        this.startDate = new Date(start_date);
        this.endDate = new Date(end_date);
        this.reminderDates = reminder_dates?.map(value => new Date(value));
        this.customerIds = customerIds;
        this.company = company;
    }

    static of({
                  name,
                  campaignConfigurationName,
                  type,
                  startDate,
                  endDate,
                  reminderDates,
                  customerIds,
                  company
              }: Campaign): CampaignTable {
        return new CampaignTable(
            name,
            campaignConfigurationName,
            getCampaignType(type),
            startDate,
            endDate,
            reminderDates,
            customerIds,
            company);
    }
}