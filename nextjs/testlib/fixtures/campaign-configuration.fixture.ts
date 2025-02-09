import {randomUUID} from "node:crypto";

export function getNewCampaignConfiguration() {
    return {
        name: `Campaign-configuration-${randomUUID()}`,
        measureValues: [{
            "name": "Gas",
            "translations": [{"locale": "nl-NL", "value": "Gas"}],
            "unit": "m3",
            "type": "NUMBER_RANGE",
            "isEditable": true,
            "defaultValue": null
        }, {
            "name": "Licht",
            "translations": [{"locale": "nl-NL", "value": "Licht"}],
            "unit": "kWh",
            "type": "NUMBER_RANGE",
            "isEditable": true,
            "defaultValue": null
        }, {
            "name": "Water",
            "translations": [{"locale": "nl-NL", "value": "Water"}],
            "unit": "m3",
            "type": "NUMBER_RANGE",
            "isEditable": true,
            "defaultValue": null
        }, {
            "name": "Random bool",
            "translations": [{"locale": "nl-NL", "value": "Leuk?"}],
            "unit": "m3",
            "type": "BOOLEAN",
            "isEditable": true,
            "defaultValue": "true"
        }]
    }
}

export function getNewCampaignConfigurationByParams({name, measureValues, entities}: NewCampaignConfigurationDetails) {
    return {
        ...getNewCampaignConfiguration(),
        ...(measureValues && {measureValues}),
        ...(name && {name}),
        ...(entities && {entities}),
    }
}

export interface NewCampaignConfigurationDetails {
    name?: string;
    measureValues?: any[];
    entities?: any[]
}