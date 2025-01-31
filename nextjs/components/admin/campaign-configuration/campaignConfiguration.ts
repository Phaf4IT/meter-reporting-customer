import {Entity} from "@/components/admin/entity/entity";
import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import {measureValueFromJson} from "@/app/api/report/report";

export interface CampaignConfiguration {
    name: string;
    measureValues: MeasureValue[];
    entities: Entity[];
}

export interface SimpleCampaignConfiguration {
    name: string;
    measureValues: any[];
    entityIds: string[];
}

export function campaignConfigurationFromJson(json: any): CampaignConfiguration {
    return {
        name: json.name,
        measureValues: json.measureValues.map((measureValue: any) => measureValueFromJson(measureValue)),
        entities: json.entities,
    }
}

export function simpleCampaignConfigurationFromJson(json: any): CampaignConfiguration {
    return {
        name: json.name,
        measureValues: json.measureValues,
        entities: json.entities,
    }
}