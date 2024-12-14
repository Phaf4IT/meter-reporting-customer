"use server"
import {deleteCampaign} from "@/app/api/admin/campaign/_database/campaignRepository";
import {Campaign} from "@/app/admin/campaign/campaign";

export async function removeCampaign(campaign: Campaign, company: string) {
    return deleteCampaign(campaign, company);
}
