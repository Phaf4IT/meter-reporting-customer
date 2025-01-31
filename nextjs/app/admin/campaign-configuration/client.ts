'use client';
import {
    CampaignConfiguration,
    campaignConfigurationFromJson
} from "@/components/admin/campaign-configuration/campaignConfiguration";

export async function getCampaignConfigurations(): Promise<CampaignConfiguration[]> {
    const data = await fetch("/api/admin/campaign-configuration", {
        method: "GET",
        credentials: "include"
    });
    const campaigns = await data.json();
    return campaigns.map((campaignData: any) => campaignConfigurationFromJson(campaignData))
}

export async function saveCampaignConfiguration(campaign: CampaignConfiguration): Promise<CampaignConfiguration> {
    const response = await fetch("/api/admin/campaign-configuration", {
        method: "POST",
        body: JSON.stringify(campaign),
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const newCampaign = await response.json();
    return campaignConfigurationFromJson(newCampaign);
}

export async function deleteCampaignConfiguration(campaign: CampaignConfiguration): Promise<Response> {
    const response = await fetch("/api/admin/campaign-configuration", {
        method: "DELETE",
        body: JSON.stringify(campaign),
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response;
}