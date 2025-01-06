"use server"
import {saveReminder} from "@/components/admin/reminder/_database/reminderRepository";
import {Reminder} from "@/components/admin/reminder/reminder";
import {findCampaignByCompanyAndName} from "@/components/admin/campaign/_database/campaignRepository";

export async function createReminder(data: Reminder, company: string) {
    return findCampaignByCompanyAndName(data.campaignName, company)
        .then(value => {
            if (value) {
                return saveReminder(data, company);
            } else {
                throw Error(`No campaign ${data.campaignName} found for ${company}`);
            }
        })
}