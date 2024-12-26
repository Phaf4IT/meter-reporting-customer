import '@testing-library/jest-dom'
import request from "supertest";
import {IWireMockRequest, IWireMockResponse} from "wiremock-captain";
import {beforeAll, describe, expect, it} from "@jest/globals";
import {getNeonClient, getWiremock, getWiremockUrl} from "@/__tests__/settings/setupTests";

/**
 * @jest-environment node
 */
describe("Customer Measurements API Mock Tests", () => {
    beforeAll(async () => {
        const request: IWireMockRequest = {
            method: 'GET',
            endpoint: '/api/customer-measurements',
        };
        const mockedResponse: IWireMockResponse = {
            status: 200,
            body: [
                {
                    customerMail: "test@example.com",
                    campaignName: "Campaign A",
                    measurements: [],
                },
            ],
        };
        await getWiremock().register(request, mockedResponse);

    });

    it("should fetch customer measurements from the mock WireMock API", async () => {
        // Doe een GET-aanroep naar de WireMock mock API
        const response = await request(getWiremockUrl()).get("/api/customer-measurements");

        // Controleer of de mock-response correct is
        expect(response.status).toBe(200);
        expect(response.body[0].customerMail).toBe("test@example.com");
    });

    it("should interact with real PostgreSQL database", async () => {
        const client = await getNeonClient();
        // Voeg een klantmeting toe aan de database voor de test
        await client(`
            INSERT INTO customer_measurement (customer_mail, campaign_name, measurements, date_time, company)
            VALUES ('test@example.com', 'Campaign A', array ['{"sender":"pablo","body":"they are on to us"}']::json[],
                    now(), 'companyX')
        `);

        // Haal klantmetingen op uit de database
        const res = await client("SELECT * FROM customer_measurement WHERE customer_mail = 'test@example.com'");

        expect(res.length).toBe(1);
        expect(res[0].customer_mail).toBe("test@example.com");
        expect(res[0].campaign_name).toBe("Campaign A");
    });
});
