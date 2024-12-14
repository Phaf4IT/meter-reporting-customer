"use server"
import {findCampaigns} from "@/app/api/admin/campaign/_database/campaignRepository";
import {auth} from "@/auth";

export async function getCampaigns() {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findCampaigns(company);
}
