import {BrowserContext, ConsoleMessage, Page, Request} from "playwright-core";
import {expect} from "chai";
import {getLoginUrl} from "@/testlib/authSessionProvider";
import {Logger} from "@/lib/logger";

export async function loginAndGoToAdminPage(context: BrowserContext, serverUrl: string, adminUrl: string, email: string, wiremock: any) {
    const page = addEventListeners(await context.newPage());
    await page.goto(`${serverUrl}${adminUrl}`);
    Logger.info(await page.content())
    await page.fill('input[name="email"]', email);
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(url => url.toString().endsWith('/api/auth/verify-request?provider=http-email&type=email'));
    const checkEmailText = await page.locator('h1').innerText();
    expect(checkEmailText).to.eq('Check your email');
    const loginUrl = await getLoginUrl(wiremock, email, serverUrl);
    await page.goto(`${serverUrl}${loginUrl}`);
    return page;
}

function addEventListeners(page: Page) {
    const listenerPageLoad = (page: Page, label: string) => {
        Logger.debug(`${label}: ${page.url()}`);
    }
    page.on('domcontentloaded', page => listenerPageLoad(page, 'Event DOMContentLoad'));
    page.on('load', page => listenerPageLoad(page, 'Event Load'));
    page.on('console', (message: ConsoleMessage) => Logger.debug(`Event Console: ${message.text()}`));
    page.on('pageerror', (error: Error) => Logger.debug(`## PAGE ERROR ##: ${error.message}`));

    const listenerRequest = (request: Request, label: string) => {
        Logger.debug(`${label}: ${request.url()} ${request.resourceType()}  ${JSON.stringify(request.headers())}`)
    };
    page.on('request', request => {
        listenerRequest(request, 'Request');
    });
    page.on('response', response => {
        Logger.debug(`Response from server with headers ${JSON.stringify(response.headers())}`)
    });
    page.on('requestfinished', request => listenerRequest(request, 'Request Finished'));
    page.on('requestfailed', request => listenerRequest(request, '## REQUEST FAILED ##'));
    return page;
}