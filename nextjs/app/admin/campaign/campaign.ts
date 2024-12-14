import {MeasureValue} from "@/app/admin/measure_value/measureValue";

export class Campaign {
    constructor(readonly customerEmails: string[],
                readonly endDate: Date,
                readonly measureValues: MeasureValue[],
                readonly reminderDates: Date[],
                readonly startDate: Date) {
    }

    static fromJSON(json: any): Campaign {
        return new Campaign(
            json.customerEmails,
            new Date(json.endDate),
            json.measureValues,
            json.reminderDates.map((date: string) => new Date(date)),
            new Date(json.startDate)
        );
    }
}