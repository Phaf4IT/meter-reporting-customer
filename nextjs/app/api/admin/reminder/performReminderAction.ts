import {Adapter} from "@auth/core/adapters";
import {GenericReminder} from "@/app/api/admin/reminder/findExpiredRemindersAction";
import {removeReminder} from "@/app/api/admin/reminder/deleteReminderAction";
import getAdapter from "@/components/authjs/auth-adapter";
import {getEmailProvider} from "@/components/authjs/email-provider";
import {Provider} from "@auth/core/providers";
import {randomUUID} from "node:crypto";
import {createReminderSent} from "@/app/api/admin/reminder-sent/createReminderSentAction";
import {signIn} from "@/node_modules/@auth/core/lib/actions";

export async function performReminder(reminder: GenericReminder, host: string) {
    const authAdapter: any = getAdapter();
    const provider: any = getEmailProvider();
    return handleReminder(authAdapter, provider, host, reminder)
}

export async function handleReminder(adapter: Adapter, provider: Provider, host: string, reminder: GenericReminder) {
    for (const customerEmail of reminder.customerEmails) {
        const customerToken: string = randomUUID()
        signIn({
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
    return removeReminder(reminder, reminder.company)
}