import {getEntity} from "@/testlib/fixtures/entity.fixture";

export async function createEntity(request: any, sessionCookie: string, entityName: string) {
    const response = await request.post('/api/admin/entity')
        .send(getEntity(entityName))
        .set('Cookie', sessionCookie);
    return await response.body;
}