import {randomUUID} from "node:crypto";
import {getRandomEmail} from "@/testlib/fixtures/email.fixture";

export function getNewReminderSent() {
    return {
        campaignName: `Campaign-${randomUUID()}`,
        reminderDate: "2025-01-02T12:00:00.000Z",
        customerEmail: getRandomEmail(),
        token: randomUUID(),
    };
}

export function getNewReminderSentByParams({campaignName, customerEmail}: {
    campaignName?: string,
    customerEmail?: string
}) {
    return {
        ...getNewReminderSent(),
        ...(campaignName && {campaignName}),
        ...(customerEmail && {customerEmail})
    };
}