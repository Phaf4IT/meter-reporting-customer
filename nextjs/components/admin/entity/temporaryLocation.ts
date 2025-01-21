import {EntityTable} from "@/components/admin/entity/_database/entityTable";
import {Customer} from "@/components/admin/customer/customer";
import {Entity} from "@/components/admin/entity/entity";

export interface TemporaryLocation {
    streetLines: string[],
    postalCode: string,
    stateOrProvinceCode: string,
    city: string,
    country: string
}

export function getLocation(entityTable: EntityTable): TemporaryLocation {
    return {
        ...entityTable.fieldValues
    }
}


export function createEntityModel(customer: Customer): Entity {
    return {
        id: customer.entityId,
        entityType: "location",
        fieldValues: {
            ...getLocationFromCustomer(customer)
        }
    };
}

export function getLocationFromCustomer(customer: Customer): TemporaryLocation {
    return {
        city: customer.city,
        country: customer.country,
        postalCode: customer.postalCode,
        stateOrProvinceCode: customer.stateOrProvinceCode,
        streetLines: customer.streetLines
    }
}