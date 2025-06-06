import {MeasureValue, measureValueFromJson} from "@/components/admin/measure-value/measureValue";
import {
    CustomerMeasurement,
    customerMeasureValueFromJson,
    MeasureValue as CustomerMeasureValue
} from "@/components/admin/customer-measurement/customerMeasurement";

export interface Campaign {
    readonly measureValues: MeasureValue[];
    readonly previousMeasureValues?: CustomerMeasureValue[];
}

export function campaignFromJson(json: any): Campaign {
    return {
        measureValues: json.measureValues.map((measureValue: any) => measureValueFromJson(measureValue)),
        previousMeasureValues: json.previousMeasureValues.map((measureValue: any) => customerMeasureValueFromJson(measureValue)),
    }
}

export function campaignFromCampaignAndMeasurement(campaign: any, previousMeasurements?: CustomerMeasurement): Campaign {
    return {
        measureValues: campaign.measureValues.map((measureValue: any) => measureValueFromJson(measureValue)),
        previousMeasureValues: previousMeasurements?.measurements,
    }
}
