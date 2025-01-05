import {randomUUID} from "node:crypto";

export function getNewReminder() {
    return {
        campaignName: `Campaign-${randomUUID()}`,
        customerEmails: ["person@example.com"],
        reminderDate: "2025-01-02T12:00:00.000Z"
    };
}