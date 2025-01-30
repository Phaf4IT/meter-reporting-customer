"use server"
import {CampaignConfiguration} from "@/components/admin/campaign-configuration/campaignConfiguration";
import {
    saveCampaignConfiguration
} from "@/components/admin/campaign-configuration/_database/campaignConfigurationRepository";

export async function createCampaignConfiguration(campaign: CampaignConfiguration, company: string) {
    return await saveCampaignConfiguration(campaign, company);
}