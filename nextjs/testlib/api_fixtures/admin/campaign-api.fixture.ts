import {getNewCampaignByParams, NewCampaignDetails} from "@/testlib/fixtures/campaign.fixture";
import {expect} from "chai";

export async function createCampaign(request: any, sessionCookie: string, campaignDetails: NewCampaignDetails) {
    const campaign = getNewCampaignByParams(campaignDetails);
    const response = await request.post('/api/admin/campaign')
        .send(campaign)
        .set('Cookie', sessionCookie);
    return await response.body;
}

export async function getCampaignByName(request: any, sessionCookie: string, campaignName: string) {
    const response = await request.get('/api/admin/campaign')
        .set('Cookie', sessionCookie);
    expect(response.status).eq(200);
    expect(Array.isArray(response.body)).eq(true);
    const campaignNames = response.body.map((campaign: any) => campaign.name);
    expect(campaignNames).contains(campaignName);
    return response.body.find((c: any) => c.name === campaignName);
}