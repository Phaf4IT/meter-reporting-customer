// import {getSessionCookie, Request} from '@/__tests__/settings/setupTests';
import {given, then, when} from '@/testlib/givenWhenThen';
import {getNewReminderSent} from "@/testlib/fixtures/reminder-sent.fixture";
import {expect} from "chai";
import supertest from "supertest";

describe('Reminder Sent API Endpoints', () => {
    let request: any;
    let sessionCookie: string;

    beforeEach(async () => {
        request = supertest(process.env.SERVER_URL!);
        sessionCookie = process.env.ADMIN_SESSION_COOKIE!;
    })

    describe('POST /api/admin/reminder-sent', () => {
        let newReminderSent: any;
        let response: any;

        given('A new reminder sent', () => {
            newReminderSent = getNewReminderSent();
        });

        when('The reminder sent is posted to the server', async () => {
            response = await request.post('/api/admin/reminder-sent')
                .send(newReminderSent)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation', async () => {
            expect(response.status).eq(200);
            expect(response.body.campaignName).eq(newReminderSent.campaignName);
            expect(response.body.customerEmail).eq(newReminderSent.customerEmail);
            expect(new Date(response.body.reminderDate).getTime()).eq(new Date(newReminderSent.reminderDate).getTime());
            expect(response.body.token).eq(newReminderSent.token);
        });
    });

    describe('GET /api/admin/reminder-sent', () => {
        let newReminderSent: any;
        let response: any;

        given('A new reminder sent is created', async () => {
            newReminderSent = getNewReminderSent();
            await request.post('/api/admin/reminder-sent').send(newReminderSent)
                .set('Cookie', sessionCookie);
        });

        when('The reminder sents are fetched from the server', async () => {
            response = await request.get('/api/admin/reminder-sent')
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the new reminder sent', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body)).eq(true);
            const campaignNames = response.body.map((reminderSent: any) => reminderSent.campaignName);
            expect(campaignNames).contains(newReminderSent.campaignName);
        });
    });

    describe('DELETE /api/admin/reminder-sent', () => {
        let newReminderSent: any;
        let response: any;

        given('A new reminder sent is created', async () => {
            newReminderSent = getNewReminderSent();
            await request.post('/api/admin/reminder-sent').send(newReminderSent)
                .set('Cookie', sessionCookie);
        });

        when('The reminder sent is deleted', async () => {
            response = await request.delete('/api/admin/reminder-sent')
                .send(newReminderSent)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate the reminder sent was deleted', () => {
            expect(response.status).eq(200);
            expect(response.body).to.deep.eq({});
        });
    });

    describe('Unauthorized Access for POST /api/admin/reminder-sent', () => {
        let newReminderSent: any;
        let response: any;

        given('A reminder sent payload', () => {
            newReminderSent = getNewReminderSent();
        });

        when('The reminder sent is posted without authorization', async () => {
            response = await request.post('/api/admin/reminder-sent').send(newReminderSent);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });
});
