import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {ReminderSentTable} from "@/components/admin/reminder-sent/_database/reminderSentTable";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";

export async function findReminderSent({token, email, company}: {
    token: string,
    email: string,
    company?: string
}): Promise<{ reminderSent?: ReminderSent, company?: string }> {
    return getEntityManager(ReminderSentTable)
        .findBy({
            token,
            customer_email: email,
            ...(company ? {company} : {})
        })
        .then((reminderSents) => {
                const foundReminderSent = reminderSents.find(() => true);
                return {
                    reminderSent: foundReminderSent ? mapTableToDomain(foundReminderSent) : undefined,
                    company: foundReminderSent?.company
                }
            }
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
        customerId: reminderSent.customerId,
        customerEmail: reminderSent.customerEmail,
        reminderDate: reminderSent.reminderDate,
        token: reminderSent.token
    }
}

function mapDomainToTable(reminderSent: ReminderSent, company: string) {
    return ReminderSentTable.of(
        {
            campaignName: reminderSent.campaignName,
            customerId: reminderSent.customerId,
            customerEmail: reminderSent.customerEmail,
            token: reminderSent.token,
            reminderDate: reminderSent.reminderDate,
            company
        });
}