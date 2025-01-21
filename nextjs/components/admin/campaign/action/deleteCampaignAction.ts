"use server"
import {deleteCampaign} from "@/components/admin/campaign/_database/campaignRepository";
import {removeReminder} from "@/components/admin/reminder/action/deleteReminderAction";
import {ModifiableCampaign} from "@/app/api/admin/campaign/route";

export async function removeCampaign(campaign: ModifiableCampaign, company: string) {
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
