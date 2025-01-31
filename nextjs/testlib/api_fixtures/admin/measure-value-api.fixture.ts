import {getMainMeasureValues} from "@/testlib/fixtures/measure-value.fixture";

export async function createMeasureValues(request: any, sessionCookie: string) {
    const measureValues = getMainMeasureValues()
        .map(value => createMeasureValue(request, sessionCookie, value));
    return Promise.all(measureValues);
}

async function createMeasureValue(request: any, sessionCookie: string, measureValue: any) {
    const response = await request.post('/api/admin/measure-value')
        .send(measureValue)
        .set('Cookie', sessionCookie);
    return await response.body;
}