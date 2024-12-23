import {findExpiredRemindersAction} from "@/app/api/admin/reminder/findExpiredRemindersAction";
import getAdapter from "@/components/authjs/auth-adapter";
import {handleReminder} from "@/app/api/admin/reminder/performReminderAction";
import {getEmailProvider} from "@/components/authjs/email-provider";

export async function reminderAction(host: string) {
    // ignore the typing for this one on purpose...
    const authAdapter: any = getAdapter();
    const provider: any = getEmailProvider();
    return findExpiredRemindersAction()
        .then(reminders => reminders
            .forEach(reminder =>
                handleReminder(authAdapter, provider, host, reminder))
        )
}