import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";
import {deleteReminderSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";

export function removeReminderSent(reminderSent: ReminderSent, company: string) {
    return deleteReminderSent(reminderSent, company);
}