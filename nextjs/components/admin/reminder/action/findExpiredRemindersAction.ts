import {findExpiredReminders} from "@/components/admin/reminder/_database/reminderRepository";
import {Customer} from "@/components/admin/customer/customer";

export async function findExpiredRemindersAction() {
    return findExpiredReminders();
}

export interface GenericReminder {
    readonly campaignName: string;
    readonly customers: Customer[];
    readonly reminderDate: Date;
    readonly company: string;
}

export function genericReminderFromJson(json: any, company: string): GenericReminder {
    return {
        campaignName: json.campaignName,
        customers: json.customers,
        reminderDate: json.reminderDate,
        company
    }
}