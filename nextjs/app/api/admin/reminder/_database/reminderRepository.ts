import {ReminderTable} from "@/app/api/admin/reminder/_database/reminderTable";
import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {Reminder} from "@/app/api/admin/reminder/reminder";
import {GenericReminder} from "@/app/api/admin/reminder/findExpiredRemindersAction";

export async function findExpiredReminders() {
    return getEntityManager(ReminderTable)
        .findByDateFilter('reminder_date', "<", new Date())
        .then(reminders => reminders.map(reminder => mapTableToGenericReminder(reminder)))
}

export async function findReminders(company: string) {
    return getEntityManager(ReminderTable)
        .findBy({
            company: company
        })
        .then((reminders) => reminders.map((reminderTable: ReminderTable) => mapTableToDomain(reminderTable))
        );

}

export async function deleteReminder(reminder: Reminder, company: string) {
    return getEntityManager(ReminderTable)
        .delete(mapDomainToTable(reminder, company))
}

export async function saveReminder(reminder: Reminder, company: string) {
    return getEntityManager(ReminderTable)
        .create(mapDomainToTable(reminder, company))
        .then(reminder => mapTableToDomain(reminder));
}

export async function updateReminder(reminder: Reminder, company: string) {
    return getEntityManager(ReminderTable)
        .update(mapDomainToTable(reminder, company))
        .then(reminder => reminder)
}

function mapTableToDomain(reminder: ReminderTable): Reminder {
    return {
        campaignName: reminder.campaignName,
        customerEmails: reminder.customerEmails,
        reminderDate: reminder.reminderDate,
    }
}

function mapTableToGenericReminder(reminder: ReminderTable): GenericReminder {
    return {
        campaignName: reminder.campaignName,
        reminderDate: reminder.reminderDate,
        customerEmails: reminder.customerEmails,
        company: reminder.company
    }
}

function mapDomainToTable(reminder: Reminder, company: string) {
    return new ReminderTable(
        reminder.campaignName,
        reminder.customerEmails,
        reminder.reminderDate,
        company);
}