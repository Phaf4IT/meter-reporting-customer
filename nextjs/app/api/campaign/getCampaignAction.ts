"use server"
import {findCampaignByCompanyAndName} from "@/app/api/admin/campaign/_database/campaignRepository";
import {auth} from "@/auth";
import {findReminderSent} from "@/app/api/admin/reminder-sent/_database/reminderSentRepository";
import {ReminderSent} from "@/app/api/admin/reminder-sent/reminder-sent";
import {Campaign, campaignFromJson} from "@/app/report/campaign";

export async function findCampaign(token: string | null): Promise<Campaign> {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findReminderSent(token!, session.user.email!, session.user.company)
        .then((reminderSent: ReminderSent | undefined) =>
            findCampaignByCompanyAndName(reminderSent!.campaignName, company)
                .then(c => campaignFromJson(c)))
}
