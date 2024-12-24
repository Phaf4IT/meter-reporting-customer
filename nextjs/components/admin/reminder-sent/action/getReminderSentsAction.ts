"use server"
import {auth} from "@/auth";
import {findRemindersSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";


export async function getReminderSents() {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findRemindersSent(company);
}
