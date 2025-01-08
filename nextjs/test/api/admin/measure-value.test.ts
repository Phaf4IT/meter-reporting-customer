import {given, then, when} from '@/testlib/givenWhenThen';
import {getNewMeasureValueNumber} from "@/testlib/fixtures/measure-value.fixture";
import {expect} from "chai";
import supertest from "supertest";
import {getEnvironmentVariableProvider} from "@/testlib/environmentVariableProvider";

describe('Measure Value API Endpoints', () => {
    let request: any;
    let sessionCookie: string;

    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
    })

    describe('POST /api/admin/measure-value', () => {
        let newMeasureValue: any;
        let response: any;

        given('A new measure value', () => {
            newMeasureValue = getNewMeasureValueNumber();
        });

        when('The measure value is posted to the server', async () => {
            response = await request.post('/api/admin/measure-value')
                .send(newMeasureValue)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation', async () => {
            expect(response.status).eq(200);
            expect(response.body.name).eq(newMeasureValue.name);
            expect(response.body.unit).eq(newMeasureValue.unit);
            expect(response.body.type).eq(newMeasureValue.type);
            expect(response.body.isEditable).eq(newMeasureValue.isEditable);
        });
    });

    describe('PUT /api/admin/measure-value', () => {
        let newMeasureValue: any;
        let updatedMeasureValue: any;
        let response: any;

        given('An existing measure value', async () => {
            newMeasureValue = getNewMeasureValueNumber();
            await request.post('/api/admin/measure-value').send(newMeasureValue)
                .set('Cookie', sessionCookie);
        });

        given('An updated measure value', () => {
            updatedMeasureValue = {...newMeasureValue, name: 'Updated Name'};
        });

        when('The measure value is updated', async () => {
            response = await request.put('/api/admin/measure-value')
                .send(updatedMeasureValue)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful update', () => {
            expect(response.status).eq(200);
            expect(response.body.name).eq(updatedMeasureValue.name);
        });
    });

    describe('GET /api/admin/measure-value', () => {
        let newMeasureValue: any;
        let response: any;

        given('A new measure value is created', async () => {
            newMeasureValue = getNewMeasureValueNumber();
            await request.post('/api/admin/measure-value').send(newMeasureValue)
                .set('Cookie', sessionCookie);
        });

        when('The measure values are fetched from the server', async () => {
            response = await request.get('/api/admin/measure-value')
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the new measure value', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body)).eq(true);
            const measureNames = response.body.map((measureValue: any) => measureValue.name);
            expect(measureNames).contains(newMeasureValue.name);
        });
    });

    describe('DELETE /api/admin/measure-value', () => {
        let newMeasureValue: any;
        let response: any;

        given('A new measure value is created', async () => {
            newMeasureValue = getNewMeasureValueNumber();
            await request.post('/api/admin/measure-value').send(newMeasureValue)
                .set('Cookie', sessionCookie);
        });

        when('The measure value is deleted', async () => {
            response = await request.delete('/api/admin/measure-value')
                .send(newMeasureValue)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate the measure value was deleted', () => {
            expect(response.status).eq(200);
            expect(response.body).to.deep.eq({});
        });
    });

    describe('Unauthorized Access for POST /api/admin/measure-value', () => {
        let newMeasureValue: any;
        let response: any;

        given('A measure value payload', () => {
            newMeasureValue = getNewMeasureValueNumber();
        });

        when('The measure value is posted without authorization', async () => {
            response = await request.post('/api/admin/measure-value').send(newMeasureValue);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

    describe('Unauthorized Access for PUT /api/admin/measure-value', () => {
        let newMeasureValue: any;
        let response: any;

        given('A measure value payload', () => {
            newMeasureValue = getNewMeasureValueNumber();
        });

        when('The measure value is updated without authorization', async () => {
            response = await request.put('/api/admin/measure-value').send(newMeasureValue);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

    describe('Unauthorized Access for DELETE /api/admin/measure-value', () => {
        let newMeasureValue: any;
        let response: any;

        given('A measure value payload', () => {
            newMeasureValue = getNewMeasureValueNumber();
        });

        when('The measure value is deleted without authorization', async () => {
            response = await request.delete('/api/admin/measure-value').send(newMeasureValue);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

});
