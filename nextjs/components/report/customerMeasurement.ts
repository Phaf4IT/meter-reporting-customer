export interface CustomerMeasurement {
    readonly measurements: MeasureValue[];
    readonly dateTime: Date;
}

export interface MeasureValue {
    readonly name: string;
    readonly value: string;
}