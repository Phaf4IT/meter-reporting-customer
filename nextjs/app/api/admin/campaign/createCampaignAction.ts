"use server"
import {Campaign} from "@/app/admin/campaign/campaign";
import {saveCampaign} from "@/app/api/admin/campaign/_database/campaignRepository";
import {createReminder} from "@/app/api/admin/reminder/createReminderAction";

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