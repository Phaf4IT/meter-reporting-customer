import {Adapter} from "@auth/core/adapters";
import {GenericReminder} from "@/components/admin/reminder/action/findExpiredRemindersAction";
import {removeReminder} from "@/components/admin/reminder/action/deleteReminderAction";
import getAdapter from "@/components/authjs/auth-adapter";
import {getEmailProvider} from "@/components/authjs/email-provider";
import {Provider} from "@auth/core/providers";
import {randomUUID} from "node:crypto";
import {createReminderSent} from "@/components/admin/reminder-sent/action/createReminderSentAction";
import {signIn} from "@/node_modules/@auth/core/lib/actions";
import {findCustomerMeasurement} from "@/components/admin/customer-measurement/action/findCustomerMeasurementAction";
import {Reminder} from "@/components/admin/reminder/reminder";
import {findCustomersByIds} from "@/components/admin/customer/_database/customerRepository";

export async function performReminder(reminder: Reminder, company: string, host: string) {
    const authAdapter: any = getAdapter();
    const provider: any = getEmailProvider();
    const customers = await findCustomersByIds(reminder.customerIds, company);
    return handleReminder(authAdapter, provider, host, {...reminder, customers, company})
}

export async function handleReminder(adapter: Adapter, provider: Provider, host: string, reminder: GenericReminder) {
    for (const customer of reminder.customers) {
        if (!await hasAlreadyCustomerMeasurement(reminder, customer.email)) {
            const customerToken: string = randomUUID()
            await signIn({
                headers: [],
                method: 'GET',
                url: host,
                body: {
                    email: customer.email,
                }
            }, [], {
                adapter,
                url: {
                    origin: host
                },
                basePath: '/api/auth',
                provider,
                callbacks: {
                    signIn: () => true
                },
                callbackUrl: `${host}/report?token=${customerToken}`,
            })
                .then(() => createReminderSent({
                    campaignName: reminder.campaignName,
                    customerId: customer.id,
                    customerEmail: customer.email,
                    reminderDate: reminder.reminderDate,
                    token: customerToken
                }, reminder.company))
        }
    }
    return removeReminder({
        campaignName: reminder.campaignName,
        customerEmails: reminder.customers.map(c => c.email),
        customerIds: reminder.customers.map(c => c.id),
        reminderDate: reminder.reminderDate,
    }, reminder.company)
}

async function hasAlreadyCustomerMeasurement(reminder: GenericReminder, customerEmail: string) {
    return await findCustomerMeasurement(reminder.campaignName, customerEmail, reminder.company);
}