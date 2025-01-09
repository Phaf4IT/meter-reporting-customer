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

export async function performReminder(reminder: GenericReminder, host: string) {
    const authAdapter: any = getAdapter();
    const provider: any = getEmailProvider();
    return handleReminder(authAdapter, provider, host, reminder)
}

export async function handleReminder(adapter: Adapter, provider: Provider, host: string, reminder: GenericReminder) {
    for (const customerEmail of reminder.customerEmails) {
        if (!await hasAlreadyCustomerMeasurement(reminder, customerEmail)) {
            const customerToken: string = randomUUID()
            await signIn({
                headers: [],
                method: 'GET',
                url: host,
                body: {
                    email: customerEmail,
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
                    customerEmail: customerEmail,
                    reminderDate: reminder.reminderDate,
                    token: customerToken
                }, reminder.company))
        }
    }
    return removeReminder(reminder, reminder.company)
}

async function hasAlreadyCustomerMeasurement(reminder: GenericReminder, customerEmail: string) {
    return await findCustomerMeasurement(reminder.campaignName, customerEmail, reminder.company);
}