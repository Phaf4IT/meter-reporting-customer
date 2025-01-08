import {given, then, when} from "@/testlib/givenWhenThen";
import {getNewCampaign} from "@/testlib/fixtures/campaign.fixture";
import {expect} from "chai";
import supertest from "supertest";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";

describe('Campaign API Endpoints', () => {
    let request: any;
    let sessionCookie: string;

    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
    })

    describe('POST /api/admin/campaigns', () => {
        let newCampaign: any;
        let response: any;

        given('A new campaign', () => {
            newCampaign = getNewCampaign();
        });

        when('The campaign is posted to the server', async () => {
            response = await request.post('/api/admin/campaign')
                .send(newCampaign)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation', async () => {
            expect(response.status).eq(200);
            expect(response.body.name).eq(newCampaign.name);
            expect(response.body.customerEmails).to.deep.eq(newCampaign.customerEmails);
        });
    });

    describe('GET /api/admin/campaigns', () => {

        let newCampaign: any;
        let response: any;

        given('A new campaign is created', async () => {
            newCampaign = getNewCampaign();
            await request.post('/api/admin/campaign').send(newCampaign)
                .set('Cookie', sessionCookie);
        });

        when('The campaigns are fetched from the server', async () => {
            response = await request.get('/api/admin/campaign')
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the new campaign', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body)).eq(true);
            const campaignNames = response.body.map((campaign: any) => campaign.name);
            expect(campaignNames).contains(newCampaign.name);
        });
    });

    describe('DELETE /api/admin/campaign', () => {

        let newCampaign: any;
        let response: any;

        given('A new campaign is created', async () => {
            newCampaign = getNewCampaign();
            await request.post('/api/admin/campaign').send(newCampaign)
                .set('Cookie', sessionCookie);
        });

        when('The campaign is deleted', async () => {
            response = await request.delete('/api/admin/campaign').send(newCampaign)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate the campaign was deleted', () => {
            expect(response.status).eq(200);
            expect(response.body).to.deep.equal({});
        });
    });

    describe('Unauthorized Access for POST /api/admin/campaign', () => {

        let newCampaign: any;
        let response: any;

        given('A campaign payload', () => {
            newCampaign = {
                name: 'Test Campaign',
                customerEmails: ['test@example.com'],
                endDate: '2024-12-31',
                measureValues: [],
                reminderDates: ['2024-12-01'],
                startDate: '2024-01-01',
            };
        });

        when('The campaign is posted without authorization', async () => {
            response = await request.post('/api/admin/campaign').send(newCampaign);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

});