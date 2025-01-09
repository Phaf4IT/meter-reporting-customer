import {given, then, when} from '@/testlib/givenWhenThen';
import {getNewCampaignByParams} from "@/testlib/fixtures/campaign.fixture";
import {
    generateRandomMeasurements,
    getNewCustomerMeasurementByParams
} from "@/testlib/fixtures/customer-measurement.fixture";
import {getRandomEmail} from "@/testlib/fixtures/email.fixture";
import {loginAndGetSession} from "@/testlib/authSessionProvider";
import {getNewReminderSentByParams} from "@/testlib/fixtures/reminder-sent.fixture";
import {createUser} from "@/testlib/db_fixtures/user.fixture";
import {expect} from "chai";
import supertest from "supertest";
import {WireMock} from "wiremock-captain";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";

describe('Report API Endpoints', () => {
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

    describe('POST /api/report', () => {
        const randomEmail = getRandomEmail();
        const campaign: any = getNewCampaignByParams({customerEmails: [randomEmail]});
        const reminderSent: any = getNewReminderSentByParams({campaignName: campaign.name, customerEmail: randomEmail});
        const customerMeasurement: any = getNewCustomerMeasurementByParams({
            customerMail: randomEmail,
            measurements: generateRandomMeasurements(campaign.measureValues)
        });
        const reportData = {
            measurements: customerMeasurement.measurements,
            dateTime: customerMeasurement.dateTime,
        };
        let response: any;

        given('A valid campaign is created', async () => {
            await request.post('/api/admin/campaign')
                .send(campaign)
                .set('Cookie', sessionCookie);
            await request.post('/api/admin/reminder-sent')
                .send(reminderSent)
                .set('Cookie', sessionCookie);
        });

        when('The report is submitted successfully', async () => {
            await createUser(randomEmail);
            const session = await loginAndGetSession(randomEmail, wiremock, serverUrl, request);
            response = await request.post(`/api/report?token=${reminderSent.token}`)
                .send(reportData)
                .set('Cookie', session);
        });

        then('The response should return a success status with a redirect', () => {
            expect(response.status).eq(307);
            expect(response.text).eq(`/success?token=${reminderSent.token}`);
        });
    });

    describe('GET /api/report', () => {
        const randomEmail = getRandomEmail();
        const campaign: any = getNewCampaignByParams({customerEmails: [randomEmail]});
        const reminderSent: any = getNewReminderSentByParams({campaignName: campaign.name, customerEmail: randomEmail});
        const customerMeasurement: any = getNewCustomerMeasurementByParams({
            customerMail: randomEmail,
            campaignName: campaign.name,
            measurements: generateRandomMeasurements(campaign.measureValues)
        });
        let response: any;

        given('A valid report exists', async () => {
            await request.post('/api/admin/campaign')
                .send(campaign)
                .set('Cookie', sessionCookie);
            await request.post('/api/admin/reminder-sent')
                .send(reminderSent)
                .set('Cookie', sessionCookie);
            await request.post('/api/admin/customer-measurement')
                .send(customerMeasurement)
                .set('Cookie', sessionCookie);
        });

        when('The report is fetched successfully', async () => {
            await createUser(randomEmail);
            const session = await loginAndGetSession(randomEmail, wiremock, serverUrl, request);
            response = await request.get(`/api/report?token=${reminderSent.token}`)
                .set('Cookie', session);
        });

        then('The response should return the report details', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body.measureValues)).eq(true);
            expect(response.body.measureValues.length).greaterThan(0);
        });
    });

    describe('POST /api/report - Unauthorized Access', () => {
        const reportData = {
            campaignName: 'some-token',
            customerMail: 'customer@example.com',
            measurements: [{name: 'Height', value: '180'}],
            dateTime: new Date().toISOString(),
        };
        let response: any;

        when('The report is submitted without authorization', async () => {
            response = await request.post('/api/report')
                .send(reportData);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

    describe('POST /api/report - Already Reported', () => {
        const customerEmail = getRandomEmail();
        const campaign: any = getNewCampaignByParams({customerEmails: [customerEmail]});
        const reminderSent: any = getNewReminderSentByParams({
            campaignName: campaign.name,
            customerEmail: customerEmail
        });
        const customerMeasurement: any = getNewCustomerMeasurementByParams({
            customerMail: customerEmail,
            campaignName: campaign.name,
            measurements: generateRandomMeasurements(campaign.measureValues)
        });
        const reportData = {
            measurements: customerMeasurement.measurements,
            dateTime: customerMeasurement.dateTime,
        };
        let response: any;

        given('The report has already been submitted for this campaign', async () => {
            await request.post('/api/admin/campaign')
                .send(campaign)
                .set('Cookie', sessionCookie);
            await request.post('/api/admin/reminder-sent')
                .send(reminderSent)
                .set('Cookie', sessionCookie);
            await request.post('/api/admin/customer-measurement')
                .send(customerMeasurement)
                .set('Cookie', sessionCookie);
        }, 10_000);

        when('A report is submitted for the same campaign again', async () => {
            await createUser(customerEmail);
            const session = await loginAndGetSession(customerEmail, wiremock, serverUrl, request);
            response = await request.post(`/api/report?token=${reminderSent.token}`)
                .send(reportData)
                .set('Cookie', session);
        });

        then('The response should return a redirect indicating already reported', () => {
            expect(response.status).eq(307);
            expect(response.text).eq(`/success?token=${reminderSent.token}`);
        });
    });


    describe('POST /api/report - Internal Server Error', () => {

        const randomEmail = getRandomEmail();
        const campaign: any = getNewCampaignByParams({customerEmails: [randomEmail]});
        const reminderSent: any = getNewReminderSentByParams({campaignName: campaign.name, customerEmail: randomEmail});
        const invalidReportData = {
            campaignName: 'invalid-token',
            customerMail: 'customer@example.com',
            measurements: [{name: 'Height', value: ''}],
            dateTime: new Date().toISOString(),
        };
        let response: any;

        given('A valid campaign is created', async () => {
            await request.post('/api/admin/campaign')
                .send(campaign)
                .set('Cookie', sessionCookie);
            await request.post('/api/admin/reminder-sent')
                .send(reminderSent)
                .set('Cookie', sessionCookie);
        }, 10_000);


        when('A report is submitted with invalid data', async () => {
            response = await request.post('/api/report')
                .send(invalidReportData)
                .set('Cookie', sessionCookie);
        });

        then('The response should return an internal server error', () => {
            expect(response.status).eq(500);
            expect(response.text).eq('Internal Server Error');
        });
    });
});
