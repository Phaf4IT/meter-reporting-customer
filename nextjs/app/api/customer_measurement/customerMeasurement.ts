export interface CustomerMeasurement {
    readonly campaignName: string;
    readonly customerMail: string;
    readonly measurements: MeasureValue[];
    readonly dateTime: Date;
}

export function customerMeasurementFromJson(json: any): CustomerMeasurement {
    return {
        campaignName: json.campaignName,
        customerMail: json.customerMail,
        measurements: json.measurements,
        dateTime: new Date(json.dateTime),
    }
}

export interface MeasureValue {
    readonly name: string;
    readonly value: string;
}