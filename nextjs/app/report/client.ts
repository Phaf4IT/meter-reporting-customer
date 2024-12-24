import {campaignFromJson} from "@/app/report/campaign";
import {CustomerMeasurement} from "@/app/report/customerMeasurement";

export async function getCampaignOptions(token: string) {
    const data = await fetch("/api/campaign?token=" + token, {
        method: "GET",
        credentials: "include"
    });
    const campaign = await data.json();
    return campaignFromJson(campaign)
}

export async function report(data: CustomerMeasurement, token: string) {
    const response = await fetch("/api/report?token=" + token, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return Promise.resolve()
}