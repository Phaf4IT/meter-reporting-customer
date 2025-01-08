/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
import {given, then, when} from '@/testlib/givenWhenThen';
import {getNewCustomer} from "@/testlib/fixtures/customer.fixture";
import {getAllTypeMeasureValues} from "@/testlib/fixtures/measure-value.fixture";
import {getNewCampaignByParams} from "@/testlib/fixtures/campaign.fixture";
import {WiremockRequest} from "@/testlib/testcontainers/wiremock";
import {expect} from "chai";
import supertest from "supertest";
import {WireMock} from "wiremock-captain";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";
import waitForExpect from "@sadams/wait-for-expect";

describe('Complete Scenario: Customer, Measure Values, Campaign, and Reminders', () => {
    const newCustomer = getNewCustomer();
    const customerEmail = newCustomer.email;
    const measureValues = getAllTypeMeasureValues();
    const reminderDate = new Date(Date.now() - 1000000).toISOString();
    const campaign = getNewCampaignByParams({
        measureValues,
        customerEmails: [customerEmail],
        reminderDates: [reminderDate]
    });
    const campaignName = campaign.name;

    let request: any;
    let sessionCookie: string;
    let reminder: any;
    let wiremock: any;

    before(() => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
        wiremock = new WireMock(environmentVariableProvider.wiremockUrl);
    });

    describe('Customer, Measure Values, Campaign Creation', () => {
        let customerResponse: any;
        let campaignResponse: any;
        let sentReminderResponse: any;

        given('A new customer and measure values are created', async () => {
            customerResponse = await request.post('/api/admin/customer')
                .send(newCustomer)
                .set('Cookie', sessionCookie);

            const measureValuePromises = measureValues.map((value) =>
                request.post('/api/admin/measure-value')
                    .send(value)
                    .set('Cookie', sessionCookie)
            );
            await Promise.all(measureValuePromises);
        });

        when('A campaign is created and customer is linked', async () => {
            campaignResponse = await request.post('/api/admin/campaign')
                .send(campaign)
                .set('Cookie', sessionCookie);
        });

        then('The customer, measure values, and campaign should be created successfully', () => {
            expect(customerResponse.status).eq(200);
            expect(campaignResponse.status).eq(200);
            expect(measureValues.length).eq(3);
        });

        given('A reminder should be created automatically with a date in the past', async () => {
            const reminderResponse = await request.get(`/api/admin/reminder`)
                .set('Cookie', sessionCookie);

            reminder = reminderResponse.body.find((reminder: any) => reminder.campaignName === campaignName && reminder.reminderDate === reminderDate);

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(reminder).to.not.be.undefined;
        });

        when('The reminder is updated (PUT request) to trigger reminders', async () => {
            sentReminderResponse = await request.put('/api/admin/reminder')
                .send(reminder)
                .set('Cookie', sessionCookie);
        });

        then('The reminder should be triggered, and Wiremock should be called', async () => {
            expect(sentReminderResponse.status).eq(200);

            await waitForExpect(async () => {
                const requests: WiremockRequest[] = await wiremock.getRequestsForAPI("POST", "/v3.1/send") as WiremockRequest[];

                const customerEmailSent = requests.map(value => JSON.parse(value.request.body))
                    .some(requestBody => requestBody.messages[0].To.some((recipient: any) => recipient.Email === customerEmail))

                expect(customerEmailSent).eq(true);
                expect(requests.length).greaterThan(0);
            });
        });
    });
});
