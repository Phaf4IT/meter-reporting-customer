export interface MeasureValue {
    readonly name: string;
    readonly translations: MeasureValueTranslation[];
    readonly unit: string | undefined;
    readonly type: MeasureValueType;
    readonly isEditable: boolean;
    readonly defaultValue?: string;
}

export function measureValueFromJson(json: any): MeasureValue {
    return {
        name: json.name,
        translations: json.translations,
        unit: json.unit,
        type: json.type,
        isEditable: json.isEditable,
        defaultValue: json.defaultValue,
    }
}

export function emptyMeasureValue(): MeasureValue {
    return {
        name: '',
        translations: [],
        unit: '',
        type: MeasureValueType.NUMBER,
        isEditable: true,
        defaultValue: '',
    }
}

export function getMeasureValueTypeName(measureValue: MeasureValue): string {
    return MeasureValueType[measureValue.type];
}

export function getTranslationsAsRecords(measureValue: MeasureValue): Record<string, string> {
    return measureValue.translations.reduce((acc, item) => {
        acc[item.locale] = item.value;
        return acc;
    }, {} as Record<string, string>)
}

export interface MeasureValueTranslation {
    readonly locale: string;
    readonly value: string;
}

export function getTranslations(translations: Record<string, string>): MeasureValueTranslation[] {
    return Object.entries(translations).map(
        ([locale, value]) => ({locale, value})
    );
}

export enum MeasureValueType {
    NUMBER = 'NUMBER', TEXT = 'TEXT', BOOLEAN = 'BOOLEAN', PHOTO_UPLOAD = 'PHOTO_UPLOAD',
}

export function getMeasureValueType(type: string): MeasureValueType {
    return MeasureValueType[type as keyof typeof MeasureValueType];
}
