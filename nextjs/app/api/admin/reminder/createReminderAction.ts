"use server"
import {saveReminder} from "@/app/api/admin/reminder/_database/reminderRepository";
import {Reminder} from "@/app/api/admin/reminder/reminder";

export async function createReminder(data: Reminder, company: string) {
    return saveReminder(data, company);
}