import {MeasureValue} from "@/app/admin/measure-value/measureValue";

export interface Campaign {
    readonly customerEmails: string[];
    readonly endDate: Date;
    readonly measureValues: MeasureValue[];
    readonly reminderDates: Date[];
    readonly startDate: Date;
}

export function campaignFromJson(json: any): Campaign {
    return {
        customerEmails: json.customerEmails,
        endDate: new Date(json.endDate),
        measureValues: json.measureValues,
        reminderDates: json.reminderDates.map((date: string) => new Date(date)),
        startDate: new Date(json.startDate),
    }
}