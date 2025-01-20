import {ReminderTable} from "@/components/admin/reminder/_database/reminderTable";
import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {Reminder} from "@/components/admin/reminder/reminder";
import {GenericReminder} from "@/components/admin/reminder/action/findExpiredRemindersAction";
import {findCustomersByIds} from "@/components/admin/customer/_database/customerRepository";
import {Customer} from "@/components/admin/customer/customer";


export async function findExpiredReminders() {
    return getEntityManager(ReminderTable)
        .findByDateFilter('reminder_date', "<", new Date())
        .then(async reminders => {
            return await matchGenericRemindersWithCustomers(reminders);
        })
}

export async function findReminders(company: string) {
    return getEntityManager(ReminderTable)
        .findBy({
            company: company
        })
        .then(async (reminders) => {
                const customersForReminders = await getCustomersForReminders(reminders, company);
                return reminders.map((reminderTable: ReminderTable) => {
                    return mapTableToDomain(reminderTable, customersForReminders);
                });
            }
        );

}

export async function deleteReminder(reminder: Reminder, company: string) {
    return getEntityManager(ReminderTable)
        .delete(mapDomainToTable(reminder, company))
}

export async function saveReminder(reminder: Reminder, company: string) {
    return getEntityManager(ReminderTable)
        .create(mapDomainToTable(reminder, company))
        .then(async reminder => {
            const customerIds: string[] = Array.from(new Set(reminder.customerIds));
            const customers = await findCustomersByIds(customerIds, company);
            return mapTableToDomain(reminder, customers);
        });
}

export async function updateReminder(reminder: Reminder, company: string) {
    return getEntityManager(ReminderTable)
        .update(mapDomainToTable(reminder, company))
        .then(reminder => reminder)
}

function mapTableToDomain(reminder: ReminderTable, customers: Customer[]): Reminder {
    return {
        campaignName: reminder.campaignName,
        customerIds: reminder.customerIds,
        customerEmails: reminder.customerIds.map(id => customers.find(customer => customer.id === id)!.email),
        reminderDate: reminder.reminderDate,
    }
}

function mapTableToGenericReminder(reminder: ReminderTable, customers: Customer[]): GenericReminder {
    return {
        campaignName: reminder.campaignName,
        reminderDate: reminder.reminderDate,
        customers: reminder.customerIds.map(id => customers.find(customer => customer.id === id)!),
        company: reminder.company
    }
}

function mapDomainToTable(reminder: Reminder, company: string) {
    return ReminderTable.ofReminderTable({
        campaignName: reminder.campaignName,
        customerIds: reminder.customerIds,
        reminderDate: reminder.reminderDate,
        company
    });
}

function groupRemindersByCompany(reminders: ReminderTable[]): Record<string, ReminderTable[]> {
    return reminders.reduce<Record<string, ReminderTable[]>>((acc, reminder) => {
        if (!acc[reminder.company]) {
            acc[reminder.company] = [];
        }
        acc[reminder.company].push(reminder);
        return acc;
    }, {});
}

async function getCustomersForReminders(groupedRemindersByCompanyElement: ReminderTable[], company: string) {
    if (groupedRemindersByCompanyElement.length > 0) {
        const customerIds: string[] = Array.from(new Set(groupedRemindersByCompanyElement.flatMap(value => value.customerIds)));
        return customerIds.length > 0 ? await findCustomersByIds(customerIds, company) : [];
    } else {
        return [];
    }
}

async function matchGenericRemindersWithCustomers(reminders: ReminderTable[]) {
    const groupedRemindersByCompany = groupRemindersByCompany(reminders);
    const mappedReminders: GenericReminder[] = [];
    for (const company in groupedRemindersByCompany) {
        const groupedRemindersByCompanyElement = groupedRemindersByCompany[company];
        const customers = await getCustomersForReminders(groupedRemindersByCompanyElement, company);
        groupedRemindersByCompanyElement.forEach(reminder => {
            mappedReminders.push(mapTableToGenericReminder(reminder, customers));
        });
    }
    return mappedReminders;
}
