import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import {Customer} from "@/components/admin/customer/customer";

export interface Campaign {
    readonly name: string;
    readonly customers: Customer[];
    readonly endDate: Date;
    readonly measureValues: MeasureValue[];
    readonly reminderDates: Date[];
    readonly startDate: Date;
    readonly configurationName: string;
    readonly type: CampaignType;
}

export function campaignFromJson(json: any): Campaign {
    return {
        name: json.name,
        customers: json.customers,
        endDate: new Date(json.endDate),
        measureValues: json.measureValues,
        reminderDates: json.reminderDates.map((date: string) => new Date(date)),
        startDate: new Date(json.startDate),
        configurationName: json.configurationName,
        type: json.type,
    }
}

export enum CampaignType {
    BASE = 'BASE',  PERIODIC = 'PERIODIC', END = 'END', START = 'START'
}

export function getCampaignType(type: string): CampaignType {
    return CampaignType[type as keyof typeof CampaignType];
}