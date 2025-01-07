import {findExpiredRemindersAction} from "@/components/admin/reminder/action/findExpiredRemindersAction";
import getAdapter from "@/components/authjs/auth-adapter";
import {handleReminder} from "@/components/admin/reminder/action/performReminderAction";
import {getEmailProvider} from "@/components/authjs/email-provider";
import {findCampaignByCompanyAndName} from "@/components/admin/campaign/_database/campaignRepository";

export async function reminderAction(host: string) {
    // ignore the typing for this one on purpose...
    const authAdapter: any = getAdapter();
    const provider: any = getEmailProvider();
    return findExpiredRemindersAction()
        .then(reminders => reminders
            .forEach(reminder =>
                findCampaignByCompanyAndName(reminder.campaignName, reminder.company).then(campaign => {
                        if (campaign) {
                            return handleReminder(authAdapter, provider, host, reminder)
                        }
                        return Promise.resolve();
                    }
                )
            )
        );
}