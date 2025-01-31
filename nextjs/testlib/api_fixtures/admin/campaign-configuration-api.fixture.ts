import {expect} from "chai";
import {
    getNewCampaignConfigurationByParams,
    NewCampaignConfigurationDetails
} from "@/testlib/fixtures/campaign-configuration.fixture";


export async function createCampaignConfiguration(request: any, sessionCookie: string, campaignDetails: NewCampaignConfigurationDetails) {
    const campaignConfiguration = getNewCampaignConfigurationByParams(campaignDetails);
    const response = await request.post('/api/admin/campaign-configuration')
        .send(campaignConfiguration)
        .set('Cookie', sessionCookie);
    return await response.body;
}

export async function getCampaignConfigurationByName(request: any, sessionCookie: string, campaignConfigurationName: string) {
    const response = await request.get('/api/admin/campaign-configuration')
        .set('Cookie', sessionCookie);
    expect(response.status).eq(200);
    expect(Array.isArray(response.body)).eq(true);
    const campaignNames = response.body.map((campaignConfiguration: any) => campaignConfiguration.name);
    expect(campaignNames).contains(campaignConfigurationName);
    return response.body.find((c: any) => c.name === campaignConfigurationName);
}