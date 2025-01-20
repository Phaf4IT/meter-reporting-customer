"use server"
import {Campaign} from "@/components/admin/campaign/campaign";
import {saveCampaign} from "@/components/admin/campaign/_database/campaignRepository";
import {createReminder} from "@/components/admin/reminder/action/createReminderAction";

export async function createCampaign(campaign: Campaign, company: string) {
    const savedCampaign = await saveCampaign(campaign, company);
    const reminderPromises = savedCampaign.reminderDates.map(date => createReminder({
            reminderDate: date,
            customerEmails: savedCampaign.customerEmails,
            customerIds: savedCampaign.customerIds,
            campaignName: savedCampaign.name
        }, company)
    );
    await Promise.all(reminderPromises);
    return savedCampaign;
}