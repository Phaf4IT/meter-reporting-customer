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
import {getCookies, getLoginUrlFromMail} from "@/testlib/authSessionProvider";
import {
    generateRandomMeasurements,
    getNewCustomerMeasurementByParams
} from "@/testlib/fixtures/customer-measurement.fixture";

describe('Complete Scenario: Customer should receive a reminder for a campaign', () => {
    const newCustomer = getNewCustomer();
    const customerEmail = newCustomer.email;
    const measureValues = getAllTypeMeasureValues();
    const reminderDate = new Date(Date.now() - 1000000).toISOString();
    const campaign = getNewCampaignByParams({
        measureValues,
        customerEmails: [customerEmail],
        reminderDates: [reminderDate]
    });
    const customerMeasurement: any = getNewCustomerMeasurementByParams({
        customerMail: newCustomer.email,
        measurements: generateRandomMeasurements(campaign.measureValues)
    });
    const reportData = {
        measurements: customerMeasurement.measurements,
        dateTime: customerMeasurement.dateTime,
    };
    const campaignName = campaign.name;

    let request: any;
    let sessionCookie: string;
    let reminder: any;
    let wiremock: any;
    let serverUrl: any;

    before(() => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
        wiremock = new WireMock(environmentVariableProvider.wiremockUrl);
        serverUrl = environmentVariableProvider.serverBaseUrl;
    });

    context('-', () => {
        let customerResponse: any;
        let campaignResponse: any;
        let sentReminderResponse: any;
        let reportResponse: any;
        let customerSessionCookie: string;
        let token: string;

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
        }, 10_000);

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
                    .find(requestBody => requestBody.messages[0].To.some((recipient: any) => recipient.Email === customerEmail))

                expect(customerEmailSent).is.not.undefined;

                const url = await getLoginUrlFromMail(requests, newCustomer.email, serverUrl);
                const urlObj = new URL(`${serverUrl}${url}`);
                const callbackUrl = urlObj.searchParams.get('callbackUrl')!;
                const callbackUrlObj = new URL(callbackUrl);
                token = callbackUrlObj.searchParams.get('token')!;
                const loggedIn: any = await request.get(url);
                customerSessionCookie = getCookies(loggedIn.get('set-cookie'), 'authjs.session-token');
            });
        });

        when('Customer fills report', async () => {
            reportResponse = await request.post(`/api/report?token=${token}`)
                .send(reportData)
                .set('Cookie', customerSessionCookie);
        })

        then('Customer has successfully submitted the report', async () => {
            expect(reportResponse.status).eq(307);
        })
    });
});
