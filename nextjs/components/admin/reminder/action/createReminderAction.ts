"use server"
import {saveReminder} from "@/components/admin/reminder/_database/reminderRepository";
import {Reminder} from "@/components/admin/reminder/reminder";

export async function createReminder(data: Reminder, company: string) {
    return saveReminder(data, company);
}