import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";
import {saveReminderSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";

export function createReminderSent(reminderSent: ReminderSent, company: string) {
    return saveReminderSent(reminderSent, company);
}