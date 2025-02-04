import {given, then, when} from '@/testlib/givenWhenThen';
import {expect} from 'chai';
import supertest from 'supertest';
import {getEnvironmentVariableProvider} from '@/testlib/environmentVariableProvider';
import {getTariff} from "@/testlib/fixtures/tariff.fixture"; // Zorg ervoor dat je een fixture voor Tariffs hebt
import {Tariff} from "@/components/admin/tariff/tariff";
import {createTariff} from "@/testlib/api_fixtures/admin/tariff-api.fixture";

describe('Tariff API Endpoints', () => {
    let request: any;
    let sessionCookie: string;

    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
    });

    describe('POST /api/admin/tariff', () => {
        let newTariff: Tariff;
        let response: any;

        given('A new tariff', async () => {
            newTariff = getTariff();
        });

        when('The tariff is posted to the server', async () => {
            response = await request.post('/api/admin/tariff')
                .send(newTariff)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation', async () => {
            expect(response.status).eq(200);
            expect(response.body.id).is.not.empty;
            expect(response.body.campaignName).eq(newTariff.campaignName);
            expect(response.body.customerIds).deep.eq(newTariff.customerIds);
            expect(response.body.description).eq(newTariff.description);
            expect(response.body.rate).eq(newTariff.rate);
            expect(response.body.currency).eq(newTariff.currency);
            expect(response.body.unit).eq(newTariff.unit);
            expect(response.body.validFrom).eq(newTariff.validFrom.toISOString());
            expect(response.body.validTo).eq(newTariff.validTo?.toISOString());
        });
    });

    describe('GET /api/admin/tariff', () => {
        let newTariff: Tariff;
        let response: any;

        given('A new tariff is created', async () => {
            newTariff = await createTariff(request, sessionCookie);
        });

        when('The tariffs are fetched from the server', async () => {
            response = await request.get('/api/admin/tariff')
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the new tariff', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body)).eq(true);
            const tariffIds = response.body.map((tariff: Tariff) => tariff.id);
            expect(tariffIds).contains(newTariff.id);
        });
    });

    describe('GET /api/admin/tariff with query parameter', () => {
        let newTariff: Tariff;
        let response: any;

        given('A new tariff is created', async () => {
            newTariff = await createTariff(request, sessionCookie);
        });

        when('The tariff is fetched using the campaign query parameter', async () => {
            response = await request.get(`/api/admin/tariff?campaign=${newTariff.campaignName}`)
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the specific tariff', () => {
            expect(response.status).eq(200);
            console.log(JSON.stringify(response.body))
            const tariff = response.body;
            expect(tariff.id).eq(newTariff.id);
            expect(tariff.campaignName).eq(newTariff.campaignName);
            expect(tariff.customerIds).deep.eq(newTariff.customerIds);
            expect(tariff.description).eq(newTariff.description);
            expect(tariff.rate).eq(newTariff.rate);
            expect(tariff.currency).eq(newTariff.currency);
            expect(tariff.unit).eq(newTariff.unit);
            expect(new Date(tariff.validFrom)).to.deep.eq(new Date(newTariff.validFrom));
            expect(tariff.validTo).eq(newTariff.validTo);
        });
    });

    describe('PUT /api/admin/tariff', () => {
        let newTariff: Tariff;
        let updatedTariff: Tariff;
        let response: any;

        given('A new tariff is created', async () => {
            newTariff = await createTariff(request, sessionCookie);
        });

        given('The tariff needs to be updated', () => {
            updatedTariff = {
                ...newTariff,
                description: 'Updated Description',
                rate: 150,
                currency: 'EUR',
                validTo: new Date('2025-12-31'),
            };
        });

        when('The tariff is updated', async () => {
            response = await request.put('/api/admin/tariff')
                .send(updatedTariff)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful update', () => {
            expect(response.status).eq(200);
            expect(response.body.description).eq(updatedTariff.description);
            expect(response.body.rate).eq(updatedTariff.rate);
            expect(response.body.currency).eq(updatedTariff.currency);
            expect(response.body.validTo).eq(updatedTariff.validTo!.toISOString());
        });
    });

    describe('DELETE /api/admin/tariff', () => {
        let newTariff: Tariff;
        let response: any;

        given('A new tariff is created', async () => {
            newTariff = await createTariff(request, sessionCookie);
        });

        when('The tariff is deleted', async () => {
            response = await request.delete('/api/admin/tariff')
                .send(newTariff)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate the tariff was deleted', () => {
            expect(response.status).eq(200);
            expect(response.body).to.deep.eq({});
        });
    });

    describe('Unauthorized Access for POST /api/admin/tariff', () => {
        let newTariff: Tariff;
        let response: any;

        given('A tariff payload', () => {
            newTariff = getTariff();
        });

        when('The tariff is posted without authorization', async () => {
            response = await request.post('/api/admin/tariff').send(newTariff);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });
});
