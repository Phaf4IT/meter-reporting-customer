import {randomUUID} from "node:crypto";
import {randomDate} from "@/testlib/randomDate";

export function getNewReminder({campaignName}: { campaignName?: string }) {
    return {
        campaignName: campaignName || `Campaign-${randomUUID()}`,
        customerEmails: ["person@example.com"],
        reminderDate: randomDate()
    };
}