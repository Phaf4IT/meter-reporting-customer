import {getNewCustomer} from "@/testlib/fixtures/customer.fixture";

export async function createCustomer(request: any, sessionCookie: string) {
    const newCustomer = getNewCustomer();
    const response = await request.post('/api/admin/customer')
        .send(newCustomer)
        .set('Cookie', sessionCookie);
    return await response.body;
}