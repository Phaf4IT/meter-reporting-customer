export interface Customer {
    id: string;
    email: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    street_lines: string[];
    postal_code: string;
    city: string;
    country: string;
    state_or_province_code: string;
    phone_number: string;
}

export async function getCustomers(): Promise<Customer[]> {
    // TODO get customers from xata table...
    return [{
        id: "1",
        email: "test@test.nl",
        first_name: "Test",
        last_name: "Bla",
        street_lines: ["Koningsstraat", "11"],
        postal_code: "3333AA",
        city: "Utrecht",
        country: "NL",
        state_or_province_code: "UT",
        phone_number: "0644444444"
    }]
}