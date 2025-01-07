import {IWireMockRequest, IWireMockResponse, WireMock} from "wiremock-captain";
// import {getServerBaseUrl, getWiremock, Request} from "@/__tests__/settings/setupTests";
import cookie from "cookie";
import {WiremockRequest} from "@/testlib/wiremock";
import TestAgent from "supertest/lib/agent";

export async function loginAndGetSession(email: string, wiremock: WireMock, serverBaseUrl: string, request: TestAgent): Promise<string> {
    const wireMockRequest: IWireMockRequest = {
        method: 'POST',
        endpoint: '/v3.1/send',
    };
    const mockedResponse: IWireMockResponse = {
        status: 200,
        body: [
            {},
        ],
    };
    await wiremock.register(wireMockRequest, mockedResponse);
    const response1: any = await request.get('/api/auth/csrf');
    const cookies = getCookies(response1.get('set-cookie'), 'authjs.csrf-token');
    const csrfToken = JSON.parse(response1.text).csrfToken;
    await request.post('/api/auth/signin/http-email')
        .set('Cookie', cookies)
        .type('form')
        .send({
            csrfToken,
            "email": email,
            "json": true,
            callbackUrl: serverBaseUrl,
            "redirect": "false"
        });
    const requests: WiremockRequest[] = await wiremock.getRequestsForAPI("POST", "/v3.1/send") as WiremockRequest[];
    const loginEmail = requests.map(value => JSON.parse(value.request.body))
        .find(value => value.messages[0].To.some((recipient: any) => recipient.Email === email));

    const url = loginEmail.messages[0].TextPart.replace("Please click here to authenticate - " + serverBaseUrl, "");
    const loggedIn: any = await request.get(url);
    return getCookies(loggedIn.get('set-cookie'), 'authjs.session-token');
}

function getCookies(cookies: string[], cookieName: string) {
    const parsedCookie = cookie.parse(cookies.find(value => value.startsWith(cookieName))!);
    delete parsedCookie.Path
    delete parsedCookie.SameSite
    return Object.entries(parsedCookie)
        .map(([key, val]) => cookie.serialize(key, val))
        .join('; ');
}