import {Browser, chromium, Page} from "playwright-core";
import {Logger} from "@/lib/logger";
import {WireMock} from "wiremock-captain";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";
import {loginAndGoToAdminPage} from "@/testlib/playwright/loginPage";
import supertest from "supertest";
import {expect} from "chai";
import {given, then, when} from "@/testlib/givenWhenThen";
import {getUtcDateAtStartOfDay} from "@/lib/dateUTCConverter";
import {format} from "date-fns";
import {toZonedTime} from "date-fns-tz";
import {createCustomer} from "@/testlib/api_fixtures/admin/customer-api.fixture";
import {createCampaign, getCampaignByName} from "@/testlib/api_fixtures/admin/campaign-api.fixture";
import {createEntityType} from "@/testlib/api_fixtures/admin/entity-type-api";
import {createEntity} from "@/testlib/api_fixtures/admin/entity-api";
import {createCampaignConfiguration} from "@/testlib/api_fixtures/admin/campaign-configuration-api.fixture";
import {createMeasureValues} from "@/testlib/api_fixtures/admin/measure-value-api.fixture";

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
        let campaignConfiguration: any;
        let customer: any;
        given('The campaign is posted to the server', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            const entity = await createEntity(request, sessionCookie, entityType.name);
            customer = await createCustomer(request, sessionCookie, entity.id);
            const measureValues = await createMeasureValues(request, sessionCookie);
            campaignConfiguration = await createCampaignConfiguration(request, sessionCookie, {
                entities: [entity],
                measureValues
            });
            campaign = await createCampaign(request, sessionCookie, {
                customerIds: [customer.id],
                customerEmails: [customer.email],
                configurationName: campaignConfiguration.name,
                measureValues
            });
            expect(await getCampaignByName(request, sessionCookie, campaign.name)).is.not.undefined;
        })

        when('The response should contain the new campaign', async () => {
            const adminUrl = `/admin/campaign`;
            const context = await browser.newContext({
                timezoneId: 'Europe/Amsterdam',
                locale: defaultLocale,
            });
            page = await loginAndGoToAdminPage(context, serverUrl, adminUrl, email, wiremock);
            await page.waitForLoadState('networkidle', {timeout: 50_000});

            await page.waitForSelector('table', {timeout: 50_000});
        }, 100_000, 3)

        then('The response should contain the new campaign', async () => {
            Logger.info(await page.content())

            const h3Element = page.locator('h3', {hasText: campaignConfiguration.name});
            const table = h3Element.locator('xpath=following-sibling::div//table');
            const rowIndex = await table.locator('tbody tr').evaluateAll((rows, campaignName) => {
                return rows.findIndex(row => {
                    const cell = row.querySelector('td:nth-child(1)');
                    return cell && cell.textContent?.trim() === campaignName;
                }); // Return de index van de rij of -1 als niet gevonden
            }, campaign.name);

            const rowLocator = table.locator(`tbody tr:nth-child(${rowIndex + 1})`);

            // Haal de data uit de rijen met Locators
            const campaignName = await rowLocator.locator('td:nth-child(1)').textContent();
            const campaignType = await rowLocator.locator('td:nth-child(2)').textContent();
            const startDate = await rowLocator.locator('td:nth-child(3)').textContent();
            const endDate = await rowLocator.locator('td:nth-child(4)').textContent();

            // Haal de reminder data uit de vijfde kolom
            const reminderDates = await rowLocator.locator('td:nth-child(5) ul li')
                .evaluateAll(reminders => reminders.map(reminder => reminder.textContent?.trim()).filter(Boolean));

            const customerEmails = await rowLocator.locator('td:nth-child(6) p')
                .evaluateAll(paragraphs => paragraphs
                    .filter(p => p.textContent?.includes('Email:'))
                    .map(p => p.textContent?.split('Email:')[1].trim()));

            const measureValues = await rowLocator.locator('td:nth-child(7)').textContent();

            const dateFormat = new Intl.DateTimeFormat('nl-NL');
            const formattedStartDate = dateFormat.format(getUtcDateAtStartOfDay(new Date(campaign.startDate)));
            const formattedEndDate = dateFormat.format(getUtcDateAtStartOfDay(new Date(campaign.endDate)));
            const formattedReminderDates = campaign.reminderDates.map((date: any) => format(toZonedTime(new Date(date), "Europe/Amsterdam"), "d-M-yyyy - HH:mm:ss"));

            expect(campaignName).to.equal(campaign.name);
            expect(campaignType).to.equal(campaign.type);
            expect(startDate).to.equal(formattedStartDate);
            expect(endDate).to.equal(formattedEndDate);
            expect(reminderDates).to.have.members(formattedReminderDates);
            expect(customerEmails).to.have.members([customer.email]);
            const expectedMeasureValues = campaign.measureValues.map((value: any) => value.name).join(', ');
            expect(measureValues).to.include(expectedMeasureValues);
        })
    })
});
