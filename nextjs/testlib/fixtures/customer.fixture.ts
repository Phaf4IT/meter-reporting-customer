import {getRandomEmail} from "@/testlib/fixtures/email.fixture";

export function getNewCustomer(entityId?: string) {
    return {
        email: getRandomEmail(),
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123-456-7890',
        entityId
    };
}