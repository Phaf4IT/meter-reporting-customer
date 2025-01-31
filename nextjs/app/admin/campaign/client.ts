'use client';
import {Campaign, campaignFromJson} from "@/components/admin/campaign/campaign";
import {ModifiableCampaign} from "@/app/api/admin/campaign/route";

export async function getCampaigns(): Promise<Campaign[]> {
    const data = await fetch("/api/admin/campaign", {
        method: "GET",
        credentials: "include"
    });
    const campaigns = await data.json();
    return campaigns.map((campaignData: any) => campaignFromJson(campaignData))
}

export async function saveCampaign(campaign: ModifiableCampaign): Promise<Campaign> {
    const response = await fetch("/api/admin/campaign", {
        method: "POST",
        body: JSON.stringify(campaign),
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const newCampaign = await response.json();
    return campaignFromJson(newCampaign);
}

export async function deleteCampaign(campaign: Campaign): Promise<Response> {
    const campaignToDelete: ModifiableCampaign = {
        ...campaign,
        customerIds: campaign.customers.map(c => c.id)
    }
    const response = await fetch("/api/admin/campaign", {
        method: "DELETE",
        body: JSON.stringify(campaignToDelete),
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response;
}