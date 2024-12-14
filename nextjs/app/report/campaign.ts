export class Campaign {
    constructor(readonly measureValues: MeasureValue[]) {
    }

    static fromJSON(json: any): Campaign {
        return new Campaign(
            json.measureValues.map((measureValue: any) => new MeasureValue(measureValue.value, measureValue.unit)),
        );
    }
}

class MeasureValue {
    constructor(readonly value: string, readonly unit: string) {
    }
}