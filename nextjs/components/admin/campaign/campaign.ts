import {MeasureValue} from "@/components/admin/measure-value/measureValue";

export interface Campaign {
    readonly name: string;
    readonly customerEmails: string[];
    readonly customerIds: string[];
    readonly endDate: Date;
    readonly measureValues: MeasureValue[];
    readonly reminderDates: Date[];
    readonly startDate: Date;
}

export function campaignFromJson(json: any): Campaign {
    return {
        name: json.name,
        customerEmails: json.customerEmails,
        customerIds: json.customerIds,
        endDate: new Date(json.endDate),
        measureValues: json.measureValues,
        reminderDates: json.reminderDates.map((date: string) => new Date(date)),
        startDate: new Date(json.startDate),
    }
}