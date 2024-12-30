import {MeasureValue, measureValueFromJson} from "@/components/admin/measure-value/measureValue";

export interface Campaign {
    readonly measureValues: MeasureValue[];
}

export function campaignFromJson(json: any): Campaign {
    return {
        measureValues: json.measureValues.map((measureValue: any)  => measureValueFromJson(measureValue)),
    }
}
