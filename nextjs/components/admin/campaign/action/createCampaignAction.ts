"use server"
import {Campaign} from "@/components/admin/campaign/campaign";
import {saveCampaign} from "@/components/admin/campaign/_database/campaignRepository";
import {createReminder} from "@/components/admin/reminder/action/createReminderAction";

export async function createCampaign(campaign: Campaign, company: string) {
    return saveCampaign(campaign, company)
        .then(savedCampaign => savedCampaign.reminderDates.flatMap(date =>
            createReminder({
                reminderDate: date,
                customerEmails: savedCampaign.customerEmails,
                campaignName: savedCampaign.name
            }, company)
        ));
}