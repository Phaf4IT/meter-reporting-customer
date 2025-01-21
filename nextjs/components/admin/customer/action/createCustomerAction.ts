"use server"
import {Customer} from "@/components/admin/customer/customer";
import {saveCustomer} from "@/components/admin/customer/_database/customerRepository";
import {Entity} from "@/components/admin/entity/entity";
import {createEntity} from "@/components/admin/entity/action/createEntityAction";
import {TemporaryLocation} from "@/components/admin/entity/temporaryLocation";

export async function createCustomer(data: Customer, company: string) {
    return createEntity(createEntityModel(data), company)
        .then(entity => saveCustomer({...data, entityId: entity.id}, company));
}

function createEntityModel(customer: Customer): Entity {
    return {
        entityType: "location",
        fieldValues: {
            ...getLocation(customer)
        }
    };
}

function getLocation(customer: Customer): TemporaryLocation {
    return {
        city: customer.city,
        country: customer.country,
        postalCode: customer.postalCode,
        stateOrProvinceCode: customer.stateOrProvinceCode,
        streetLines: customer.streetLines
    }
}