import {MeasureValueTranslation, MeasureValueType} from "@/components/admin/measure-value/measureValue";

export interface Report {
    readonly measureValues: Measurements[];
    readonly dateTime: Date;
}

export function reportFromJson(json: any): Report {
    return {
        measureValues: json.measureValues.map((measureValue: any) => measureValueFromJson(measureValue)),
        dateTime: json.dateTime,
    }
}

export interface Measurements {
    readonly name: string;
    readonly value: string;
    readonly translations: MeasureValueTranslation[];
    readonly unit: string | undefined;
    readonly type: MeasureValueType;
    readonly isEditable: boolean;
    readonly defaultValue?: string;
}


export function measureValueFromJson(json: any): Measurements {
    return {
        name: json.name,
        value: json.value,
        translations: json.translations,
        unit: json.unit,
        type: json.type,
        isEditable: json.isEditable,
        defaultValue: json.defaultValue,
    }
}
