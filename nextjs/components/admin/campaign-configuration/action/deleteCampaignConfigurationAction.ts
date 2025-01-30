"use server"
import {
    deleteCampaignConfiguration
} from "@/components/admin/campaign-configuration/_database/campaignConfigurationRepository";
import {CampaignConfiguration} from "@/components/admin/campaign-configuration/campaignConfiguration";

export async function removeCampaignConfiguration(campaign: CampaignConfiguration, company: string) {
    return deleteCampaignConfiguration(campaign, company);
}
