import {Entity} from "@/components/admin/entity/entity";

export interface Customer {
    id: string;
    email: string;
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    entity?: Entity;
    phoneNumber: string;
}

export function customerFromJson(json: any): Customer {
    return {
        id: json.id,
        email: json.email,
        title: json.title,
        firstName: json.firstName,
        middleName: json.middleName,
        entity: json.entity,
        lastName: json.lastName,
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
        phoneNumber: ''
    }
}