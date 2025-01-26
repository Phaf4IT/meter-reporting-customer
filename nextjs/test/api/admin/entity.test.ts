import {given, then, when} from '@/testlib/givenWhenThen';
import {expect} from 'chai';
import supertest from 'supertest';
import {getEnvironmentVariableProvider} from '@/testlib/environmentVariableProvider';
import {createEntityType} from '@/testlib/api_fixtures/admin/entity-type-api';
import {createEntity} from '@/testlib/api_fixtures/admin/entity-api';
import {getEntity} from "@/testlib/fixtures/entity.fixture";
import {Entity} from "@/components/admin/entity/entity";

describe('Entity API Endpoints', () => {
    let request: any;
    let sessionCookie: string;

    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
    });

    describe('POST /api/admin/entity', () => {
        let newEntity: any;
        let response: any;

        given('A new entity', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            newEntity = getEntity(entityType.name);
        });

        when('The entity is posted to the server', async () => {
            response = await request.post('/api/admin/entity')
                .send(newEntity)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation', () => {
            expect(response.status).to.eq(200);
            expect(response.body.entityTypeName).to.eq(newEntity.entityTypeName);
            expect(response.body.fieldValues.name).to.eq(newEntity.fieldValues.name);
        });
    });

    describe('GET /api/admin/entity', () => {
        let newEntity: Entity;
        let response: any;

        given('A new entity is created', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            newEntity = await createEntity(request, sessionCookie, entityType.name);
        });

        when('The entities are fetched from the server', async () => {
            response = await request.get('/api/admin/entity')
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the new entity', () => {
            expect(response.status).to.eq(200);
            expect(Array.isArray(response.body)).to.eq(true);
            const entity: Entity = response.body.find(() => true);
            const streetLines = entity.fieldValues.streetLines;
            expect(newEntity.fieldValues.streetLines).to.deep.eq(streetLines);
        });
    });

    describe('PUT /api/admin/entity', () => {
        let newEntity: any;
        let updatedEntity: any;
        let response: any;

        given('A new entity is created', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            newEntity = await createEntity(request, sessionCookie, entityType.name);
        });

        given('The entity needs to be updated', () => {
            updatedEntity = {
                ...newEntity,
                fieldValues: {
                    ...newEntity.fieldValues,
                    city: 'other'
                }
            };
        });

        when('The entity information is updated', async () => {
            response = await request.put('/api/admin/entity')
                .send(updatedEntity)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful update', () => {
            expect(response.status).to.eq(200);
            expect(response.body.fieldValues.city).to.eq(updatedEntity.fieldValues.city);
        });
    });

    describe('DELETE /api/admin/entity', () => {
        let newEntity: any;
        let response: any;

        given('A new entity is created', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            newEntity = await createEntity(request, sessionCookie, entityType.name);
        });

        when('The entity is deleted', async () => {
            response = await request.delete('/api/admin/entity')
                .send(newEntity)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate the entity was deleted', () => {
            expect(response.status).to.eq(200);
            expect(response.body).to.deep.eq({});
        });
    });

    describe('Unauthorized Access for POST /api/admin/entity', () => {
        let newEntity: any;
        let response: any;

        given('An entity payload', async () => {
            const entityType = await createEntityType(request, sessionCookie);
            newEntity = getEntity(entityType.name);
        });

        when('The entity is posted without authorization', async () => {
            response = await request.post('/api/admin/entity').send(newEntity);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).to.eq(401);
            expect(response.text).to.eq('Unauthorized');
        });
    });

});
