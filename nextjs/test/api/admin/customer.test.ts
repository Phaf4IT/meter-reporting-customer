import {given, then, when} from '@/testlib/givenWhenThen';
import {getNewCustomer} from "@/testlib/fixtures/customer.fixture";
import {expect} from "chai";
import supertest from "supertest";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";

describe('Customer API Endpoints', () => {
    let request: any;
    let sessionCookie: string;

    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
    })

    describe('POST /api/admin/customer', () => {
        let newCustomer: any;
        let response: any;

        given('A new customer', () => {
            newCustomer = getNewCustomer();
        });

        when('The customer is posted to the server', async () => {
            response = await request.post('/api/admin/customer')
                .send(newCustomer)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation', async () => {
            expect(response.status).eq(200);
            expect(response.body.email).eq(newCustomer.email);
            expect(response.body.firstName).eq(newCustomer.firstName);
            expect(response.body.lastName).eq(newCustomer.lastName);
        });
    });

    describe('GET /api/admin/customer', () => {
        let newCustomer: any;
        let response: any;

        given('A new customer is created', async () => {
            newCustomer = getNewCustomer();
            await request.post('/api/admin/customer').send(newCustomer)
                .set('Cookie', sessionCookie);
        });

        when('The customers are fetched from the server', async () => {
            response = await request.get('/api/admin/customer')
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the new customer', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body)).eq(true);
            const customerEmails = response.body.map((customer: any) => customer.email);
            expect(customerEmails).contains(newCustomer.email);
        });
    });

    describe('PUT /api/admin/customer', () => {
        let newCustomer: any;
        let updatedCustomer: any;
        let response: any;

        given('A new customer is created', async () => {
            newCustomer = getNewCustomer();
            await request.post('/api/admin/customer').send(newCustomer)
                .set('Cookie', sessionCookie);
        });

        given('The customer information needs to be updated', () => {
            updatedCustomer = {
                ...newCustomer,
                firstName: 'UpdatedFirstName',
                lastName: 'UpdatedLastName'
            };
        });

        when('The customer information is updated', async () => {
            response = await request.put('/api/admin/customer')
                .send(updatedCustomer)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful update', async () => {
            expect(response.status).eq(200);
            expect(response.body.firstName).eq(updatedCustomer.firstName);
            expect(response.body.lastName).eq(updatedCustomer.lastName);
        });
    });

    describe('DELETE /api/admin/customer', () => {
        let newCustomer: any;
        let response: any;

        given('A new customer is created', async () => {
            newCustomer = getNewCustomer();
            const createdCustomerResponse = await request.post('/api/admin/customer').send(newCustomer)
                .set('Cookie', sessionCookie);
            const createdCustomer = await createdCustomerResponse.body;
            newCustomer = {...createdCustomer}
        });

        when('The customer is deleted', async () => {
            response = await request.delete('/api/admin/customer')
                .send(newCustomer)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate the customer was deleted', () => {
            expect(response.status).eq(200);
            expect(response.body).to.deep.eq({});
        });
    });

    describe('Unauthorized Access for POST /api/admin/customer', () => {
        let newCustomer: any;
        let response: any;

        given('A customer payload', () => {
            newCustomer = getNewCustomer();
        });

        when('The customer is posted without authorization', async () => {
            response = await request.post('/api/admin/customer').send(newCustomer);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

});
