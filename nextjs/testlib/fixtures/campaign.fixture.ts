import {randomUUID} from "node:crypto";
import {getRandomEmail} from "@/testlib/fixtures/email.fixture";

export function getNewCampaign() {
    return {
        "name": `Campaign-${randomUUID()}`,
        "startDate": "2025-01-02T00:00:00.000Z",
        "endDate": "2025-01-29T00:00:00.000Z",
        "reminderDates": ["2025-01-02T12:00:00.000Z", "2025-01-09T06:00:00.000Z", "2025-01-16T00:00:00.000Z", "2025-01-22T18:00:00.000Z", "2025-01-29T12:00:00.000Z"],
        "customerEmails": [getRandomEmail()],
        "measureValues": [{
            "name": "Gas",
            "translations": [{"locale": "nl-NL", "value": "Gas"}],
            "unit": "m3",
            "type": "NUMBER",
            "isEditable": true,
            "defaultValue": null
        }, {
            "name": "Licht",
            "translations": [{"locale": "nl-NL", "value": "Licht"}],
            "unit": "kWh",
            "type": "NUMBER",
            "isEditable": true,
            "defaultValue": null
        }, {
            "name": "Water",
            "translations": [{"locale": "nl-NL", "value": "Water"}],
            "unit": "m3",
            "type": "NUMBER",
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
    };
}

export function getNewCampaignByParams({measureValues, customerEmails, reminderDates}: {
    measureValues?: any[], customerEmails?: string[], reminderDates?: string[]
}) {
    return {
        ...getNewCampaign(),
        ...(measureValues && {measureValues}),
        ...(customerEmails && {customerEmails}),
        ...(reminderDates && {reminderDates}),
    };
}