import {findExpiredReminders} from "@/app/api/admin/reminder/_database/reminderRepository";

export async function findExpiredRemindersAction() {
    return findExpiredReminders();
}

export interface GenericReminder {
    readonly campaignName: string;
    readonly customerEmails: string[];
    readonly reminderDate: Date;
    readonly company: string;
}

export function genericReminderFromJson(json: any, company: string): GenericReminder {
    return {
        campaignName: json.campaignName,
        customerEmails: json.customerEmails,
        reminderDate: json.reminderDate,
        company
    }
}