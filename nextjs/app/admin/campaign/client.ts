'use client';
import {Campaign, campaignFromJson} from "@/app/admin/campaign/campaign";

export async function getCampaigns() : Promise<Campaign[]> {
    const data = await fetch("/api/admin/campaign", {
        method: "GET",
        credentials: "include"
    });
    const campaigns = await data.json();
    return campaigns.map((campaignData: any) => campaignFromJson(campaignData))
}

export async function saveCampaign(campaign: Campaign): Promise<Campaign> {
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
    const response = await fetch("/api/admin/campaign", {
        method: "DELETE",
        body: JSON.stringify(campaign),
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response;
}