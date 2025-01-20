import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import {Customer} from "@/components/admin/customer/customer";

export interface Campaign {
    readonly name: string;
    readonly customers: Customer[];
    readonly endDate: Date;
    readonly measureValues: MeasureValue[];
    readonly reminderDates: Date[];
    readonly startDate: Date;
}

export function campaignFromJson(json: any): Campaign {
    return {
        name: json.name,
        customers: json.customers,
        endDate: new Date(json.endDate),
        measureValues: json.measureValues,
        reminderDates: json.reminderDates.map((date: string) => new Date(date)),
        startDate: new Date(json.startDate),
    }
}