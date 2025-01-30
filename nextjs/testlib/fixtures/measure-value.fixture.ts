import {randomUUID} from "node:crypto";

export function getAllTypeMeasureValues() {
    return [getNewMeasureValueNumber(), getNewMeasureValueBoolean(), getNewMeasureValueText()]
}

export function getMainMeasureValues() {
    return [{
        "name": `Gas-${randomUUID()}`,
        "translations": [{"locale": "nl-NL", "value": "Gas"}],
        "unit": "m3",
        "type": "NUMBER",
        "isEditable": true,
        "defaultValue": null
    }, {
        "name": `Licht-${randomUUID()}`,
        "translations": [{"locale": "nl-NL", "value": "Licht"}],
        "unit": "kWh",
        "type": "NUMBER",
        "isEditable": true,
        "defaultValue": null
    }, {
        "name": `Water-${randomUUID()}`,
        "translations": [{"locale": "nl-NL", "value": "Water"}],
        "unit": "m3",
        "type": "NUMBER",
        "isEditable": true,
        "defaultValue": null
    }, {
        "name": `Random bool-${randomUUID()}`,
        "translations": [{"locale": "nl-NL", "value": "Leuk?"}],
        "unit": "m3",
        "type": "BOOLEAN",
        "isEditable": true,
        "defaultValue": "true"
    }]
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