import {randomUUID} from "node:crypto";

export function getAllTypeMeasureValues() {
    return [getNewMeasureValueNumber(), getNewMeasureValueBoolean(), getNewMeasureValueText()]
}

export function getNewMeasureValueNumber() {
    return {
        name: `Measure-${randomUUID()}`,
        translations: [
            {locale: 'nl-NL', value: 'Aantal'},
            {locale: 'en-US', value: 'Count'},
        ],
        unit: 'm3',
        type: 'NUMBER',
        isEditable: true,
        defaultValue: null,
    };
}

export function getNewMeasureValueText() {
    return {
        name: `Measure-${randomUUID()}`,
        translations: [
            {locale: 'nl-NL', value: 'Voorbeeld'},
            {locale: 'en-US', value: 'A sample description'},
        ],
        unit: undefined,
        type: 'TEXT',
        isEditable: true,
        defaultValue: null,
    };
}

export function getNewMeasureValueBoolean() {
    return {
        name: `Measure-${randomUUID()}`,
        translations: [
            {locale: 'nl-NL', value: 'Is gebruiker actief?'},
            {locale: 'en-US', value: 'Is the user active?'},
        ],
        unit: undefined,
        type: 'BOOLEAN',
        isEditable: false,
        defaultValue: null,
    };
}