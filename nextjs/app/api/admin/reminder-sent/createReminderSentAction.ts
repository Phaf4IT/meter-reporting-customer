import {ReminderSent} from "@/app/api/admin/reminder-sent/reminder-sent";
import {saveReminderSent} from "@/app/api/admin/reminder-sent/_database/reminderSentRepository";

export function createReminderSent(reminderSent: ReminderSent, company: string) {
    return saveReminderSent(reminderSent, company);
}