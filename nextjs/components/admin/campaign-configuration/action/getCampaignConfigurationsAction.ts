"use server"
import {auth} from "@/auth";
import {
    findCampaignConfigurationsByCompany
} from "@/components/admin/campaign-configuration/_database/campaignConfigurationRepository";

export async function getCampaignConfigurations() {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findCampaignConfigurationsByCompany(company);
}
