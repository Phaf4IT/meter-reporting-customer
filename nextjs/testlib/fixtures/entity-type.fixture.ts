import {EntityType} from "@/components/admin/entity-type/entityType";
import {randomUUID} from "node:crypto";

export function getEntityType(): EntityType {
    return {
        name: randomUUID(),
        fields: {
            "streetLines": {
                "type": "text[]",
                "required": true
            },
            "postalCode": {
                "type": "text",
                "required": true
            },
            "city": {
                "type": "text",
                "required": true
            },
            "country": {
                "type": "text",
                "required": true
            },
            "stateOrProvinceCode": {
                "type": "text",
                "required": true
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