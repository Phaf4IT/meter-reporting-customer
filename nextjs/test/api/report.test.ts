import {given, then, when} from '@/testlib/givenWhenThen';
import {
    generateRandomMeasurements,
    getNewCustomerMeasurementByParams
} from "@/testlib/fixtures/customer-measurement.fixture";
import {loginAndGetSession} from "@/testlib/authSessionProvider";
import {createUser} from "@/testlib/db_fixtures/user.fixture";
import {expect} from "chai";
import supertest from "supertest";
import {WireMock} from "wiremock-captain";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";
import {createCustomer} from "@/testlib/api_fixtures/admin/customer-api.fixture";
import {createCampaign} from "@/testlib/api_fixtures/admin/campaign-api.fixture";
import {createReminderSent} from "@/testlib/api_fixtures/admin/reminder-sent-api.fixture";
import {createCustomerMeasurement} from "@/testlib/api_fixtures/admin/customer-measurement-api.fixture";
import {createEntityType} from "@/testlib/api_fixtures/admin/entity-type-api";
import {createEntity} from "@/testlib/api_fixtures/admin/entity-api";
import {createCampaignConfiguration} from "@/testlib/api_fixtures/admin/campaign-configuration-api.fixture";
import {createMeasureValues} from "@/testlib/api_fixtures/admin/measure-value-api.fixture";

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
        let customer: any;
        let campaign: any;
        let reminderSent: any;
        let customerMeasurement: any
        let reportData: any;
        let response: any;

        given('A valid campaign is created', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            const entity = await createEntity(request, sessionCookie, entityType.name);
            customer = await createCustomer(request, sessionCookie, entity.id);
            const measureValues = await createMeasureValues(request, sessionCookie);
            const campaignConfiguration = await createCampaignConfiguration(request, sessionCookie, {
                entities: [entity],
                measureValues
            });
            campaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email],
                configurationName: campaignConfiguration.name,
                measureValues
            });
            reminderSent = await createReminderSent(request, sessionCookie, {campaign, customer});
            customerMeasurement = getNewCustomerMeasurementByParams({
                customerMail: customer.email,
                measurements: generateRandomMeasurements(campaign.measureValues)
            });
            reportData = {
                measurements: customerMeasurement.measurements,
                dateTime: customerMeasurement.dateTime,
            };
        });

        when('The report is submitted successfully', async () => {
            await createUser(customer);
            const session = await loginAndGetSession(customer.email, wiremock, serverUrl, request);
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
        let customer: any;
        let campaign: any;
        let reminderSent: any;
        let response: any;
        let session: string;

        given('A valid report exists', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            const entity = await createEntity(request, sessionCookie, entityType.name);
            customer = await createCustomer(request, sessionCookie, entity.id);
            const measureValues = await createMeasureValues(request, sessionCookie);
            const campaignConfiguration = await createCampaignConfiguration(request, sessionCookie, {
                entities: [entity],
                measureValues
            });
            campaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email],
                configurationName: campaignConfiguration.name,
                measureValues
            });
            reminderSent = await createReminderSent(request, sessionCookie, {campaign, customer});

            await createCustomerMeasurement(request, sessionCookie, {
                campaign,
                customerMail: customer.email,
                campaignConfiguration
            })
        });

        given('A session for the customer is created', async () => {
            await createUser(customer.email);
            session = await loginAndGetSession(customer.email, wiremock, serverUrl, request);
        }, 10_000)

        when('The report is fetched successfully', async () => {
            response = await request.get(`/api/report?token=${reminderSent.token}`)
                .set('Cookie', session);
        });

        then('The response should return the report details', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body.measureValues)).eq(true);
            expect(response.body.measureValues.length).greaterThan(0);
        });
    });

    describe('POST /api/report - Unauthorized Access and Random report', () => {
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

    describe('POST /api/report - Unauthorized Access', () => {
        let customer: any;
        let campaign: any;
        let reminderSent: any;
        let customerMeasurement: any
        let reportData: any;
        let response: any;

        given('A valid campaign is created', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            const entity = await createEntity(request, sessionCookie, entityType.name);
            customer = await createCustomer(request, sessionCookie, entity.id);
            const campaignConfiguration = await createCampaignConfiguration(request, sessionCookie, {entities: [entity]});
            campaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email],
                configurationName: campaignConfiguration.name
            });
            reminderSent = await createReminderSent(request, sessionCookie, {campaign, customer});
            customerMeasurement = getNewCustomerMeasurementByParams({
                customerMail: customer.email,
                measurements: generateRandomMeasurements(campaign.measureValues)
            });
            reportData = {
                measurements: customerMeasurement.measurements,
                dateTime: customerMeasurement.dateTime,
            };
        });

        when('The report is submitted successfully', async () => {
            response = await request.post(`/api/report?token=${reminderSent.token}`)
                .send(reportData);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

    describe('POST /api/report - Already Reported', () => {
        let customer: any;
        let campaign: any;
        let reminderSent: any;
        let reportData: any;
        let response: any;
        let session: string;

        given('A valid report exists', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            const entity = await createEntity(request, sessionCookie, entityType.name);
            customer = await createCustomer(request, sessionCookie, entity.id);
            const measureValues = await createMeasureValues(request, sessionCookie);
            const campaignConfiguration = await createCampaignConfiguration(request, sessionCookie, {
                entities: [entity],
                measureValues
            });
            campaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email],
                configurationName: campaignConfiguration.name,
                measureValues
            });
            reminderSent = await createReminderSent(request, sessionCookie, {campaign, customer});

            const customerMeasurement = await createCustomerMeasurement(request, sessionCookie, {
                campaign,
                customerMail: customer.email,
                campaignConfiguration
            });
            reportData = {
                measurements: customerMeasurement.measurements,
                dateTime: customerMeasurement.dateTime,
            };
        });

        given('A session for the customer', async () => {
            await createUser(customer.email);
            session = await loginAndGetSession(customer.email, wiremock, serverUrl, request);
        }, 10_000);

        when('A report is submitted for the same campaign again', async () => {
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
        let customer: any;
        let campaign: any;
        let invalidReportData: any;
        let response: any;

        given('A valid report exists', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            const entity = await createEntity(request, sessionCookie, entityType.name);
            customer = await createCustomer(request, sessionCookie, entity.id);
            const measureValues = await createMeasureValues(request, sessionCookie);
            const campaignConfiguration = await createCampaignConfiguration(request, sessionCookie, {
                entities: [entity],
                measureValues
            });
            campaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email],
                configurationName: campaignConfiguration.name,
                measureValues
            });
            await createReminderSent(request, sessionCookie, {campaign, customer});
            invalidReportData = {
                measurements: [{name: 'Height', value: ''}],
                dateTime: new Date().toISOString(),
            };
        });

        when('A report is submitted with invalid data', async () => {
            await createUser(customer);
            const session = await loginAndGetSession(customer.email, wiremock, serverUrl, request);
            response = await request.post('/api/report')
                .send(invalidReportData)
                .set('Cookie', session);
        });

        then('The response should return an internal server error', () => {
            expect(response.status).eq(500);
            expect(response.text).eq('Internal Server Error');
        });
    });
});
