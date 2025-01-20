import {given, then, when} from '@/testlib/givenWhenThen';
import {getNewReminderSentByParams} from "@/testlib/fixtures/reminder-sent.fixture";
import {getNewCustomerMeasurementByParams} from "@/testlib/fixtures/customer-measurement.fixture";
import {loginAndGetSession} from "@/testlib/authSessionProvider";
import {createUser} from "@/testlib/db_fixtures/user.fixture";
import {expect} from "chai";
import supertest from "supertest";
import {WireMock} from "wiremock-captain";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";
import {createCustomer} from "@/testlib/api_fixtures/admin/customer-api.fixture";
import {createCampaign} from "@/testlib/api_fixtures/admin/campaign-api.fixture";
import {createReminderSent} from "@/testlib/api_fixtures/admin/reminder-sent-api.fixture";

describe('Campaign API Endpoints', () => {
    let request: any;
    let wiremock: any;
    let sessionCookie: string;
    let serverUrl: string;

    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
        wiremock = new WireMock(environmentVariableProvider.wiremockUrl);
        serverUrl = environmentVariableProvider.serverBaseUrl;
    });

    describe('GET /api/campaign', () => {
        let randomEmail: string;
        let reminderSent: any;
        let response: any;

        given('A valid campaign is created', async () => {
            const customer = await createCustomer(request, sessionCookie);
            const campaign = await createCampaign(request, sessionCookie, {
                customerEmails: [customer.email],
                customerIds: [customer.id]
            })
            randomEmail = customer.email;
            reminderSent = getNewReminderSentByParams({
                campaignName: campaign.name,
                customerEmail: randomEmail,
                customerId: customer.id
            });
            await request.post('/api/admin/reminder-sent')
                .send(reminderSent)
                .set('Cookie', sessionCookie);
        });

        when('The campaign is fetched from the server', async () => {
            await createUser(randomEmail);
            const session = await loginAndGetSession(randomEmail, wiremock, serverUrl, request);
            response = await request.get(`/api/campaign?token=${reminderSent.token}`)
                .set('Cookie', session);
        });

        then('The response should return the campaign details', () => {
            expect(response.status).eq(200);
            expect(response.body.measureValues.length).greaterThan(0);
            expect(Array.isArray(response.body.measureValues)).eq(true);
        });
    });

    describe('GET /api/campaign - Already Reported', () => {
        let reminderSent: any;
        let response: any;

        given('A valid campaign is created', async () => {
            const customer = await createCustomer(request, sessionCookie);
            const customerEmail = customer.email;
            const campaign = await createCampaign(request, sessionCookie, {
                customerEmails: [customer.email],
                customerIds: [customer.id]
            })
            reminderSent = await createReminderSent(request, sessionCookie, {campaign, customer});
            const customerMeasurement = getNewCustomerMeasurementByParams({
                customerMail: customerEmail,
                campaignName: campaign.name
            });

            await request.post('/api/admin/customer-measurement')
                .send(customerMeasurement)
                .set('Cookie', sessionCookie);
        });

        when('The already reported campaign is fetched', async () => {
            await createUser(reminderSent.customerEmail);
            const session = await loginAndGetSession(reminderSent.customerEmail, wiremock, serverUrl, request);
            response = await request.get(`/api/campaign?token=${reminderSent.token}`)
                .set('Cookie', session);
        });

        then('The response should indicate a redirect due to already reported status', () => {
            expect(response.status).eq(307);
            expect(response.text).eq(`/success?token=${reminderSent.token}`);
        });
    });

    describe('GET /api/campaign - Unauthorized Access', () => {
        let response: any;
        let reminderSent: any;

        given('A campaign token', async () => {
            const customer = await createCustomer(request, sessionCookie);
            const campaign = await createCampaign(request, sessionCookie, {
                customerEmails: [customer.email],
                customerIds: [customer.id]
            })
            reminderSent = await createReminderSent(request, sessionCookie, {campaign, customer});
        });

        when('The campaign is fetched without authorization', async () => {
            response = await request.get(`/api/campaign?token=${reminderSent.token}`);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

    describe('GET /api/campaign - Internal Server Error', () => {
        let response: any;

        given('A campaign token that causes an error', () => {
            // Simuleer een situatie waarbij een interne fout optreedt bij het ophalen van de campagne
        });

        when('The campaign is fetched and an error occurs', async () => {
            response = await request.get(`/api/campaign?token=invalid-token`)
                .set('Cookie', sessionCookie);
        });

        then('The response should return an internal server error', () => {
            expect(response.status).eq(500);
            expect(response.text).eq('Internal Server Error');
        });
    });

});
