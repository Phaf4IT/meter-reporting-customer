import {getTariff} from "@/testlib/fixtures/tariff.fixture";

export async function createTariff(request: any, sessionCookie: string) {
    const response = await request.post('/api/admin/tariff')
        .send(getTariff())
        .set('Cookie', sessionCookie);
    return await response.body;
}