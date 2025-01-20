import {randomUUID} from "node:crypto";
import {getRandomEmail} from "@/testlib/fixtures/email.fixture";

export function getNewReminderSent() {
    return {
        campaignName: `Campaign-${randomUUID()}`,
        reminderDate: "2025-01-02T12:00:00.000Z",
        customerEmail: getRandomEmail(),
        customerId: randomUUID(),
        token: randomUUID(),
    };
}

export function getNewReminderSentByParams({campaignName, customerEmail, customerId}: {
    campaignName?: string,
    customerEmail?: string
    customerId?: string
}) {
    return {
        ...getNewReminderSent(),
        ...(campaignName && {campaignName}),
        ...(customerEmail && {customerEmail}),
        ...(customerId && {customerId})
    };
}