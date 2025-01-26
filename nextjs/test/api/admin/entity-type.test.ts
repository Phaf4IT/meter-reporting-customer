import {given, then, when} from '@/testlib/givenWhenThen';
import {expect} from 'chai';
import supertest from 'supertest';
import {getEnvironmentVariableProvider} from '@/testlib/environmentVariableProvider';
import {getEntityType} from "@/testlib/fixtures/entity-type.fixture";
import {createEntityType} from "@/testlib/api_fixtures/admin/entity-type-api";
import {EntityType} from "@/components/admin/entity-type/entityType";

describe('Entity Type API Endpoints', () => {
    let request: any;
    let sessionCookie: string;

    before(async () => {
        const environmentVariableProvider = getEnvironmentVariableProvider();
        request = supertest(environmentVariableProvider.serverBaseUrl);
        sessionCookie = environmentVariableProvider.sessionCookie;
    });

    describe('POST /api/admin/entity-type', () => {
        let newEntityType: EntityType;
        let response: any;

        given('A new entity type', async () => {
            newEntityType = getEntityType();
        });

        when('The entity type is posted to the server', async () => {
            response = await request.post('/api/admin/entity-type')
                .send(newEntityType)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful creation', async () => {
            expect(response.status).eq(200);
            expect(response.body.name).eq(newEntityType.name);
            expect(response.body.fields).deep.eq(newEntityType.fields);
            expect(response.body.translations).deep.eq(newEntityType.translations);
        });
    });

    describe('GET /api/admin/entity-type', () => {
        let newEntityType: EntityType;
        let response: any;

        given('A new entity type is created', async () => {
            newEntityType = await createEntityType(request, sessionCookie);
        });

        when('The entity types are fetched from the server', async () => {
            response = await request.get('/api/admin/entity-type')
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the new entity type', () => {
            expect(response.status).eq(200);
            expect(Array.isArray(response.body)).eq(true);
            const entityTypeNames = response.body.map((entityType: EntityType) => entityType.name);
            expect(entityTypeNames).contains(newEntityType.name);
        });
    });

    describe('GET /api/admin/entity-type with query parameter', () => {
        let newEntityType: EntityType;
        let response: any;

        given('A new entity type is created', async () => {
            newEntityType = await createEntityType(request, sessionCookie);
        });

        when('The entity type is fetched using the type query parameter', async () => {
            response = await request.get(`/api/admin/entity-type?type=${newEntityType.name}`)
                .set('Cookie', sessionCookie);
        });

        then('The response should contain the specific entity type', () => {
            expect(response.status).eq(200);
            expect(response.body.name).eq(newEntityType.name);
            expect(response.body.fields).deep.eq(newEntityType.fields);
            expect(response.body.translations).deep.eq(newEntityType.translations);
        });
    });

    describe('PUT /api/admin/entity-type', () => {
        let newEntityType: EntityType;
        let updatedEntityType: EntityType;
        let response: any;

        given('A new entity type is created', async () => {
            newEntityType = await createEntityType(request, sessionCookie);
        });

        given('The entity type needs to be updated', () => {
            updatedEntityType = {
                ...newEntityType,
                fields: {
                    ...newEntityType.fields,
                    description: {type: 'text', required: true},
                },
                translations: {
                    ...newEntityType.translations,
                    'en-US': {...newEntityType.translations['en-US'], description: 'Description'},
                },
            };
        });

        when('The entity type is updated', async () => {
            response = await request.put('/api/admin/entity-type')
                .send(updatedEntityType)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate successful update', () => {
            expect(response.status).eq(200);
            expect(response.body.fields).to.have.property('description');
            expect(response.body.translations['en-US']).to.have.property('description', 'Description');
        });
    });

    describe('DELETE /api/admin/entity-type', () => {
        let newEntityType: EntityType;
        let response: any;

        given('A new entity type is created', async () => {
            newEntityType = await createEntityType(request, sessionCookie);
        });

        when('The entity type is deleted', async () => {
            response = await request.delete('/api/admin/entity-type')
                .send(newEntityType)
                .set('Cookie', sessionCookie);
        });

        then('The response should indicate the entity type was deleted', () => {
            expect(response.status).eq(200);
            expect(response.body).to.deep.eq({});
        });
    });

    describe('Unauthorized Access for POST /api/admin/entity-type', () => {
        let newEntityType: EntityType;
        let response: any;

        given('An entity type payload', () => {
            newEntityType = getEntityType();
        });

        when('The entity type is posted without authorization', async () => {
            response = await request.post('/api/admin/entity-type').send(newEntityType);
        });

        then('The response should return 401 Unauthorized', () => {
            expect(response.status).eq(401);
            expect(response.text).eq('Unauthorized');
        });
    });

});
