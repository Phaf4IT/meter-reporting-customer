"use server"
import {findReminderSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";
import {auth} from "@/auth";

export async function getReminderSent(token: string, email: string, company: string) {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    if (session.user.company !== company || session.user.email !== email) {
        throw new Error('Niet geautoriseerd.');
    }
    return findReminderSent(token, email, company);
}