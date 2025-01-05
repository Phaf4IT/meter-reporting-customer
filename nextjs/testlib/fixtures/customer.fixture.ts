import {getRandomEmail} from "@/testlib/fixtures/email.fixture";

export function getNewCustomer() {
    return {
        email: getRandomEmail(),
        firstName: 'John',
        lastName: 'Doe',
        streetLines: ['1234 Elm Street'],
        postalCode: '12345',
        city: 'Metropolis',
        country: 'Country',
        stateOrProvinceCode: 'NY',
        phoneNumber: '123-456-7890'
    };
}