"use server"
import {saveCampaign} from "@/components/admin/campaign/_database/campaignRepository";
import {createReminder} from "@/components/admin/reminder/action/createReminderAction";
import {ModifiableCampaign} from "@/app/api/admin/campaign/route";

export async function createCampaign(campaign: ModifiableCampaign, company: string) {
    const savedCampaign = await saveCampaign(campaign, company);
    const reminderPromises = savedCampaign.reminderDates.map(date => createReminder({
            reminderDate: date,
            customerEmails: savedCampaign.customers.map(c => c.email),
            customerIds: savedCampaign.customers.map(c => c.id),
            campaignName: savedCampaign.name
        }, company)
    );
    await Promise.all(reminderPromises);
    return savedCampaign;
}