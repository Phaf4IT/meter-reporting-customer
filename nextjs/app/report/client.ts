import {campaignFromJson} from "@/app/report/campaign";

export async function getCampaignOptions(token: string) {
    const data = await fetch("/api/campaign?token=" + token, {
        method: "GET",
        credentials: "include"
    });
    const campaign = await data.json();
    return campaignFromJson(campaign)
}