import {getNewCampaignByParams, NewCampaignDetails} from "@/testlib/fixtures/campaign.fixture";

export async function createCampaign(request: any, sessionCookie: string, campaignDetails: NewCampaignDetails) {
    const campaign = getNewCampaignByParams(campaignDetails);
    const response = await request.post('/api/admin/campaign')
        .send(campaign)
        .set('Cookie', sessionCookie);
    return await response.body;
}