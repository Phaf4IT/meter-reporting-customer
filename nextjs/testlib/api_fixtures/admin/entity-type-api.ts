import {getEntityType} from "@/testlib/fixtures/entity-type.fixture";

export async function createEntityType(request: any, sessionCookie: string) {
    const response = await request.post('/api/admin/entity-type')
        .send(getEntityType())
        .set('Cookie', sessionCookie);
    return await response.body;
}