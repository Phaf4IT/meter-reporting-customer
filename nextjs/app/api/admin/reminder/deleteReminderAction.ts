"use server"
import {deleteReminder} from "@/app/api/admin/reminder/_database/reminderRepository";
import {Reminder} from "@/app/api/admin/reminder/reminder";

export async function removeReminder(reminder: Reminder, company: string) {
    return deleteReminder(reminder, company);
}
