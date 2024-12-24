"use server"
import {findCampaignsByCompany} from "@/components/admin/campaign/_database/campaignRepository";
import {auth} from "@/auth";

export async function getCampaigns() {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findCampaignsByCompany(company);
}
