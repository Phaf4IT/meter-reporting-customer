import {Browser, chromium, ElementHandle, Page} from "playwright-core";
import {Logger} from "@/lib/logger";
import {WireMock} from "wiremock-captain";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";
import {loginAndGoToAdminPage} from "@/testlib/playwright/loginPage";
import supertest from "supertest";
import {getNewCampaign} from "@/testlib/fixtures/campaign.fixture";
import {expect} from "chai";
import {given, then, when} from "@/testlib/givenWhenThen";
import {getUtcDateAtStartOfDay} from "@/lib/dateUTCConverter";
import {format} from "date-fns";
import {toZonedTime} from "date-fns-tz";

describe('Open admin in browser', () => {
    let browser: Browser;
    let email: string;
    let wiremock: any;
    let serverUrl: string;
    let sessionCookie: string;
    let request: any;
    let page: Page;
    let defaultLocale: string;
    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        browser = await chromium.connect(environmentVariableProvider.playwrightWebsocketUrl, {})
        email = environmentVariableProvider.adminEmail;
        wiremock = new WireMock(environmentVariableProvider.wiremockUrl);
        serverUrl = environmentVariableProvider.serverBaseUrl;
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
        defaultLocale = environmentVariableProvider.defaultLocale;
    })
    after(async () => browser.close());

    describe('Open admin campaigns in browser', () => {
        let campaign: any;
        given('The campaign is posted to the server', async () => {
            campaign = getNewCampaign();
            const response = await request.post('/api/admin/campaign')
                .send(campaign)
                .set('Cookie', sessionCookie);
            expect(response.status).eq(200);
        })
        when('The response should contain the new campaign', async () => {
            const adminUrl = `/admin/campaign`;
            const context = await browser.newContext({
                timezoneId: 'Europe/Amsterdam',
                locale: defaultLocale,
            });
            page = await loginAndGoToAdminPage(context, serverUrl, adminUrl, email, wiremock);
            await page.waitForSelector('table');
        })
        then('The response should contain the new campaign', async () => {
            Logger.info(await page.content())
            const rowIndex = await page.$$eval('table tbody tr', (rows: any, campaignName: string) => {
                return rows.findIndex((row: any) => row.querySelector('td:nth-child(1)').textContent.trim() === campaignName);
            }, campaign.name);

            expect(rowIndex).to.not.eq(-1);
            const row: ElementHandle<HTMLElement | SVGElement> = (await page.$(`table tbody tr:nth-child(${rowIndex + 1})`))!;

            const campaignName = await row.$eval('td:nth-child(1)', td => td.textContent!.trim());
            const startDate = await row.$eval('td:nth-child(2)', td => td.textContent!.trim());
            const endDate = await row.$eval('td:nth-child(3)', td => td.textContent!.trim());
            const reminderDates = await row.$$eval('td:nth-child(4) ul li', reminderDates =>
                reminderDates.map(reminder => reminder.textContent!.trim())
            );
            const customerEmails = await row.$$eval('td:nth-child(5) ul li', emails =>
                emails.map(email => email.textContent!.trim())
            );
            const measureValues = await row.$eval('td:nth-child(6)', td => td.textContent!.trim());

            const dateFormat = new Intl.DateTimeFormat('nl-NL');
            const formattedStartDate = dateFormat.format(getUtcDateAtStartOfDay(new Date(campaign.startDate)));
            const formattedEndDate = dateFormat.format(getUtcDateAtStartOfDay(new Date(campaign.endDate)));
            const formattedReminderDates = campaign.reminderDates.map((date: any) => format(toZonedTime(new Date(date), "Europe/Amsterdam"), "d-M-yyyy - HH:mm:ss"));

            expect(campaignName).to.equal(campaign.name);
            expect(startDate).to.equal(formattedStartDate);
            expect(endDate).to.equal(formattedEndDate);
            expect(reminderDates).to.have.members(formattedReminderDates);
            expect(customerEmails).to.have.members(campaign.customerEmails);
            const expectedMeasureValues = campaign.measureValues.map((value: any) => value.name).join(', ');
            expect(measureValues).to.include(expectedMeasureValues);
        })
    })
});
