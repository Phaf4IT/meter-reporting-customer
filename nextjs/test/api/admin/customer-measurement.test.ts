import {given, then, when} from '@/testlib/givenWhenThen';
import {getMeasurement, getNewCustomerMeasurement} from "@/testlib/fixtures/customer-measurement.fixture";
import {expect} from "chai";
import supertest from "supertest";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";

describe('Customer Measurement API Endpoints', () => {
    let request: any;
    let sessionCookie: string;

    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
    })

    describe('GET /api/admin/customer-measurement', () => {
        let response: any;
        let newCustomerMeasurement: any;
        given('An existing session and customer measurements', async () => {
            // Pre-create some customer measurements to ensure the GET request has data
            newCustomerMeasurement = getNewCustomerMeasurement();
            await request.post('/api/admin/customer-measurement')
                .send(newCustomerMeasurement)
                .set('Cookie', sessionCookie);
        });

        when('The customer measurements are fetched from the server', async () => {
            response = await request.get('/api/admin/customer-measurement')
                .set('Cookie', sessionCookie);
        });

        then('The response should return customer measurements', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body)).eq(true);
            expect(response.body.length).greaterThanOrEqual(0);
            expect(response.body[0].campaignName).eq(newCustomerMeasurement.campaignName);
            expect(response.body[0].customerMail).eq(newCustomerMeasurement.customerMail);
        });
    });

    describe('POST /api/admin/customer-measurement', () => {
        let newCustomerMeasurement: any;
        let response: any;

        given('A new customer measurement payload', () => {
            newCustomerMeasurement = getNewCustomerMeasurement();
        });

        when('The customer measurement is posted to the server', async () => {
            response = await request.post('/api/admin/customer-measurement')
                .send(newCustomerMeasurement)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation of the customer measurement', () => {
            expect(response.status).eq(200);
            expect(response.body.customerMail).eq(newCustomerMeasurement.customerMail);
            expect(response.body.campaignName).eq(newCustomerMeasurement.campaignName);
            expect(response.body.measurements.length).eq(newCustomerMeasurement.measurements.length);
        });
    });

    describe('PUT /api/admin/customer-measurement', () => {
        let newCustomerMeasurement: any;
        let updatedCustomerMeasurement: any;
        let response: any;

        given('An existing customer measurement is created', async () => {
            newCustomerMeasurement = getNewCustomerMeasurement();
            await request.post('/api/admin/customer-measurement')
                .send(newCustomerMeasurement)
                .set('Cookie', sessionCookie);
        });

        given('An updated customer measurement payload', () => {
            updatedCustomerMeasurement = {...newCustomerMeasurement, measurements: getMeasurement('30', '50')};
        });

        when('The customer measurement is updated', async () => {
            response = await request.put('/api/admin/customer-measurement')
                .send(updatedCustomerMeasurement)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful update of the customer measurement', () => {
            expect(response.status).eq(200);
            expect(response.body.measurements).to.deep.eq(getMeasurement('30', '50'));
        });
    });

    describe('Unauthorized Access for GET /api/admin/customer-measurement', () => {
        let response: any;

        when('The customer measurements are fetched without authorization', async () => {
            response = await request.get('/api/admin/customer-measurement');
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

    describe('Unauthorized Access for POST /api/admin/customer-measurement', () => {
        let newCustomerMeasurement: any;
        let response: any;

        given('A customer measurement payload', () => {
            newCustomerMeasurement = getNewCustomerMeasurement();
        });

        when('The customer measurement is posted without authorization', async () => {
            response = await request.post('/api/admin/customer-measurement')
                .send(newCustomerMeasurement);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

    describe('Unauthorized Access for PUT /api/admin/customer-measurement', () => {
        let updatedCustomerMeasurement: any;
        let response: any;

        given('An updated customer measurement payload', () => {
            updatedCustomerMeasurement = getNewCustomerMeasurement();
            updatedCustomerMeasurement.campaignName = 'Updated Campaign';
        });

        when('The customer measurement is updated without authorization', async () => {
            response = await request.put('/api/admin/customer-measurement')
                .send(updatedCustomerMeasurement);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });
});
