export class MeasureValue {
    readonly name: string;
    readonly translations: MeasureValueTranslation[];
    readonly unit: string | undefined;
    readonly type: MeasureValueType;
    readonly isEditable: boolean;
    readonly defaultValue?: string;

    constructor(name: string,
                translations: MeasureValueTranslation[],
                unit: string | undefined,
                type: string,
                isEditable: boolean,
                defaultValue?: string) {
        this.name = name;
        this.translations = translations;
        this.unit = unit;
        this.type = MeasureValueType[type as keyof typeof MeasureValueType];
        this.isEditable = isEditable;
        this.defaultValue = defaultValue;
    }

    getType = () => {
        return MeasureValueType[this.type];
    }

    getTranslations = () => {
        return this.translations.reduce((acc, item) => {
            acc[item.locale] = item.value;
            return acc;
        }, {} as Record<string, string>)
    }

    static fromJSON(json: any): MeasureValue {
        return new MeasureValue(json.name, json.translations, json.unit, json.type, json.isEditable, json.defaultValue);
    }
}

export class MeasureValueTranslation {
    readonly locale: string;
    readonly value: string;

    constructor(locale: string, value: string) {
        this.locale = locale;
        this.value = value;
    }

    static getTranslations(translations: Record<string, string>): MeasureValueTranslation[] {
        return Object.entries(translations).map(
            ([locale, value]) => new MeasureValueTranslation(locale, value)
        )
    }
}

export enum MeasureValueType {
    NUMBER, TEXT, BOOLEAN
}