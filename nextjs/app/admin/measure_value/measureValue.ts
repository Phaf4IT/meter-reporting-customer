export class MeasureValue {
    readonly name: string;
    readonly unit: string;

    constructor(name: string, unit: string) {
        this.name = name;
        this.unit = unit;
    }
}