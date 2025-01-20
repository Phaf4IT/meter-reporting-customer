export interface Customer {
    id: string;
    email: string;
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    streetLines: string[];
    postalCode: string;
    city: string;
    country: string;
    stateOrProvinceCode: string;
    phoneNumber: string;
}

export function customerFromJson(json: any): Customer {
    return {
        id: json.id,
        email: json.email,
        title: json.title,
        firstName: json.firstName,
        middleName: json.middleName,
        lastName: json.lastName,
        streetLines: json.streetLines,
        postalCode: json.postalCode,
        city: json.city,
        country: json.country,
        stateOrProvinceCode: json.stateOrProvinceCode,
        phoneNumber: json.phoneNumber
    };
}

export function emptyCustomer(): Customer {
    return {
        id: '',
        email: '',
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        streetLines: [''],
        postalCode: '',
        city: '',
        country: '',
        stateOrProvinceCode: '',
        phoneNumber: ''
    }
}