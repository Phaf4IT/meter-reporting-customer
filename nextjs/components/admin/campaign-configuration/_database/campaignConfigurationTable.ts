import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import {Entity} from "@/lib/jpa/entity";
import CampaignConfiguration from "@/components/database/schemas/public/CampaignConfiguration";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";

@EntityClass("campaign_configuration")
export class CampaignConfigurationTable extends Entity implements CampaignConfiguration {
    @PrimaryKey
    @Field()
    name: string;
    @Field("measure_value_names")
    measureValueNames: string[];
    @Field("entity_ids")
    entityIds: string[];
    @PrimaryKey
    @Field()
    company: string;

    constructor(name: string, measureValueNames: string[], entityIds: string[], company: string) {
        super();
        this.name = name;
        this.measureValueNames = measureValueNames;
        this.entityIds = entityIds;
        this.company = company;
    }

    static of({name, measureValueNames, entityIds, company}: CampaignConfiguration): CampaignConfigurationTable {
        return new CampaignConfigurationTable(name, measureValueNames, entityIds, company);
    }
}
