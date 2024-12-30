import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {ReminderSentTable} from "@/components/admin/reminder-sent/_database/reminderSentTable";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";

export async function findReminderSent(token: string, email: string, company: string) {
    return getEntityManager(ReminderSentTable)
        .findBy({
            token: token,
            customer_email: email,
            company: company
        })
        .then((reminderSents) =>
            reminderSents.map((reminderSentTable: ReminderSentTable) => mapTableToDomain(reminderSentTable)).find(() => true)
        );
}

export async function findRemindersSent(company: string) {
    return getEntityManager(ReminderSentTable)
        .findBy({
            company: company
        })
        .then((reminderSents) =>
            reminderSents.map((reminderSentTable: ReminderSentTable) => mapTableToDomain(reminderSentTable))
        );
}

export async function deleteReminderSent(reminderSent: ReminderSent, company: string) {
    return getEntityManager(ReminderSentTable)
        .delete(mapDomainToTable(reminderSent, company))
}

export async function saveReminderSent(reminderSent: ReminderSent, company: string) {
    return getEntityManager(ReminderSentTable)
        .create(mapDomainToTable(reminderSent, company))
        .then(reminderSent => mapTableToDomain(reminderSent));
}

function mapTableToDomain(reminderSent: ReminderSentTable): ReminderSent {
    return {
        campaignName: reminderSent.campaignName,
        customerEmail: reminderSent.customerEmail,
        reminderDate: reminderSent.reminderDate,
        token: reminderSent.token
    }
}

function mapDomainToTable(reminderSent: ReminderSent, company: string) {
    return new ReminderSentTable(
        reminderSent.campaignName,
        reminderSent.customerEmail,
        reminderSent.token,
        reminderSent.reminderDate,
        company);
}