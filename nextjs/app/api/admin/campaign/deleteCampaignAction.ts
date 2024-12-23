"use server"
import {deleteCampaign} from "@/app/api/admin/campaign/_database/campaignRepository";
import {Campaign} from "@/app/admin/campaign/campaign";
import {removeReminder} from "@/app/api/admin/reminder/deleteReminderAction";

export async function removeCampaign(campaign: Campaign, company: string) {
    return deleteCampaign(campaign, company)
        .then(() => campaign.reminderDates.flatMap(date =>
            removeReminder({
                reminderDate: date,
                customerEmails: campaign.customerEmails,
                campaignName: campaign.name,
            }, company)
        ));
}
