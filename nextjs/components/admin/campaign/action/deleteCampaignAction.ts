"use server"
import {deleteCampaign} from "@/components/admin/campaign/_database/campaignRepository";
import {Campaign} from "@/components/admin/campaign/campaign";
import {removeReminder} from "@/components/admin/reminder/action/deleteReminderAction";

export async function removeCampaign(campaign: Campaign, company: string) {
    return deleteCampaign(campaign, company)
        .then(() => campaign.reminderDates.flatMap(date =>
            removeReminder({
                reminderDate: date,
                // can be left empty, they are no primary keys...
                customerEmails: [],
                customerIds: [],
                campaignName: campaign.name,
            }, company)
        ));
}
