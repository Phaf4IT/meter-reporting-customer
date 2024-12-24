"use server"
import {deleteReminder} from "@/components/admin/reminder/_database/reminderRepository";
import {Reminder} from "@/components/admin/reminder/reminder";

export async function removeReminder(reminder: Reminder, company: string) {
    return deleteReminder(reminder, company);
}
