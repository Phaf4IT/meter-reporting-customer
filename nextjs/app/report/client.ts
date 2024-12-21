import {campaignFromJson} from "@/app/report/campaign";

export async function getCampaignOptions() {
    const data = await fetch("/api/campaign", {
        method: "GET",
        credentials: "include"
    });
    const campaign = await data.json();
    return campaign.map((customerData: any) => campaignFromJson(customerData))
}