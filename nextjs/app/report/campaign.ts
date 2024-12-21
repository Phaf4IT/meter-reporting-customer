export interface Campaign {
    readonly measureValues: MeasureValue[];
}

export function campaignFromJson(json: any): Campaign {
    return {
        measureValues: json.measureValues.map((measureValue: any) => measureValue),
    }
}

interface MeasureValue {
    readonly value: string;
    readonly unit: string;
}