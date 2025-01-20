import {given, then, when} from '@/testlib/givenWhenThen';
import {getNewReminder} from "@/testlib/fixtures/reminder.fixture";
import {expect} from "chai";
import supertest from "supertest";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";
import {createCustomer} from "@/testlib/api_fixtures/admin/customer-api.fixture";
import {createCampaign} from "@/testlib/api_fixtures/admin/campaign-api.fixture";

describe('Reminder API Endpoints', () => {
    let request: any;
    let sessionCookie: string;

    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
    })

    describe('POST /api/admin/reminder', () => {
        let newReminder: any;
        let response: any;

        given('A new reminder', async () => {
            const customer = await createCustomer(request, sessionCookie);
            const newCampaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email]
            });
            newReminder = getNewReminder({campaignName: newCampaign.name, customer});
        });

        when('The reminder is posted to the server', async () => {
            response = await request.post('/api/admin/reminder')
                .send(newReminder)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation', async () => {
            expect(response.status).eq(200);
            expect(response.body.campaignName).eq(newReminder.campaignName);
            expect(response.body.customerEmails).to.deep.eq(newReminder.customerEmails);
            expect(new Date(response.body.reminderDate).getTime()).eq(new Date(newReminder.reminderDate).getTime());
        });
    });

    describe('POST invalid /api/admin/reminder', () => {
        let newReminder: any;
        let response: any;

        given('A new reminder', () => {
            newReminder = getNewReminder({});
        });

        when('The reminder is posted to the server', async () => {
            response = await request.post('/api/admin/reminder')
                .send(newReminder)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation', async () => {
            expect(response.status).eq(500);
        });
    });

    describe('GET /api/admin/reminder', () => {
        let newReminder: any;
        let response: any;

        given('A new reminder is created', async () => {
            const customer = await createCustomer(request, sessionCookie);
            const newCampaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email]
            });
            newReminder = getNewReminder({campaignName: newCampaign.name, customer});
            await request.post('/api/admin/reminder').send(newReminder)
                .set('Cookie', sessionCookie);
        });

        when('The reminders are fetched from the server', async () => {
            response = await request.get('/api/admin/reminder')
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the new reminder', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body)).eq(true);
            const campaignNames = response.body.map((reminder: any) => reminder.campaignName);
            expect(campaignNames).contains(newReminder.campaignName);
        });
    });

    describe('PUT /api/admin/reminder', () => {
        let newReminder: any;
        let response: any;

        given('A new reminder is created', async () => {
            const customer = await createCustomer(request, sessionCookie);
            const newCampaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email]
            });
            newReminder = getNewReminder({campaignName: newCampaign.name, customer});
            await request.post('/api/admin/reminder').send(newReminder)
                .set('Cookie', sessionCookie);
        });

        when('The reminder sent request is performed', async () => {
            response = await request.put('/api/admin/reminder')
                .send(newReminder)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful update', async () => {
            expect(response.status).eq(200);
        });
    });

    describe('DELETE /api/admin/reminder', () => {
        let newReminder: any;
        let response: any;

        given('A new reminder is created', async () => {
            newReminder = getNewReminder({});
            await request.post('/api/admin/reminder').send(newReminder)
                .set('Cookie', sessionCookie);
        });

        when('The reminder is deleted', async () => {
            response = await request.delete('/api/admin/reminder')
                .send(newReminder)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate the reminder was deleted', () => {
            expect(response.status).eq(200);
            expect(response.body).to.deep.eq({});
        });
    });

    describe('Unauthorized Access for POST /api/admin/reminder', () => {
        let newReminder: any;
        let response: any;

        given('A reminder payload', async () => {
            const customer = await createCustomer(request, sessionCookie);
            const newCampaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email]
            });
            newReminder = getNewReminder({campaignName: newCampaign.name, customer});
        });

        when('The reminder is posted without authorization', async () => {
            response = await request.post('/api/admin/reminder').send(newReminder);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

});
