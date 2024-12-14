"use server"
import {Campaign} from "@/app/admin/campaign/campaign";
import {saveCampaign} from "@/app/api/admin/campaign/_database/campaignRepository";

export async function createCampaign(data: Campaign, company: string) {
    return saveCampaign(data, company)
}