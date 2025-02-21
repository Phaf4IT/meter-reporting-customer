import {Entity} from "@/components/admin/entity/entity";
import {Field} from "@/components/admin/entity-type/entityType";
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";

export interface Customer {
    id: string;
    email: string;
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    entity?: Entity;
    phoneNumber?: string;
    additionalFields?: any;
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
        phoneNumber: json.phoneNumber,
        additionalFields: json.additionalFields
    };
}

export function emptyCustomer(): Customer & ModifiableCustomer {
    return {
        id: '',
        email: '',
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
        entityId: ''
    }
}

interface AdditionalFields {
    fields: Record<string, Field>;
    translations: Record<string, any>;
}

// TODO should become configurable
export function additionalFields(): AdditionalFields {
    return {
        fields: {
            "streetLines":
                {
                    "type":
                        "text[]",
                    "required":
                        true
                }
            ,
            "postalCode":
                {
                    "type":
                        "text",
                    "required":
                        true
                }
            ,
            "city":
                {
                    "type":
                        "text",
                    "required":
                        true
                }
            ,
            "country":
                {
                    "type":
                        "text",
                    "required":
                        true
                }
            ,
            "stateOrProvinceCode":
                {
                    "type":
                        "text",
                    "required":
                        true
                }
        },
        translations: {
            "nl-NL": {
                "location": "Locatie",
                "streetLines": "Adresregels",
                "postalCode": "Postcode",
                "city": "Stad",
                "country": "Land",
                "stateOrProvinceCode": "Provincie"
            },
            "en-US": {
                "location": "Location",
                "streetLines": "Streetlines",
                "postalCode": "Postal code",
                "city": "City",
                "country": "Country",
                "stateOrProvinceCode": "Province"
            }
        }
    }
}