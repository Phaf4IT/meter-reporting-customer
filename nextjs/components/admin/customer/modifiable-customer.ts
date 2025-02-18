export interface ModifiableCustomer {
    id: string;
    email: string;
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    entityId?: string;
    phoneNumber: string;
    additionalFields?: any
}

export function modifiableCustomerFromJson(json: any): ModifiableCustomer {
    return {
        id: json.id,
        email: json.email,
        title: json.title,
        firstName: json.firstName,
        middleName: json.middleName,
        lastName: json.lastName,
        entityId: json.entityId,
        phoneNumber: json.phoneNumber,
        additionalFields: json.additionalFields
    };
}

export function emptyModifiableCustomer(): ModifiableCustomer {
    return {
        id: '',
        email: '',
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: ''
    }
}