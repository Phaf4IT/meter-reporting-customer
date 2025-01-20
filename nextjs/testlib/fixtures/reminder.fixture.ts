import {randomUUID} from "node:crypto";
import {randomDate} from "@/testlib/randomDate";
import {Customer} from "@/components/admin/customer/customer";

export function getNewReminder({campaignName, customer}: { campaignName?: string, customer?: Customer }) {
    return {
        campaignName: campaignName || `Campaign-${randomUUID()}`,
        customerEmails: [customer ? customer.email : "person@example.com"],
        customerIds: [customer ? customer.id : randomUUID()],
        reminderDate: randomDate()
    };
}