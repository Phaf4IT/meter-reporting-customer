"use server"
import {auth} from "@/auth";
import {findReminders} from "@/app/api/admin/reminder/_database/reminderRepository";


export async function getReminders() {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findReminders(company);
}
