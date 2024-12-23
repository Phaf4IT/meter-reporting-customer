import {ReminderSent} from "@/app/api/admin/reminder-sent/reminder-sent";
import {deleteReminderSent} from "@/app/api/admin/reminder-sent/_database/reminderSentRepository";

export function removeReminderSent(reminderSent: ReminderSent, company: string) {
    return deleteReminderSent(reminderSent, company);
}