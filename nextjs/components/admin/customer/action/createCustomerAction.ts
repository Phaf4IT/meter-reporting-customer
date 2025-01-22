"use server"
import {Customer} from "@/components/admin/customer/customer";
import {saveCustomer} from "@/components/admin/customer/_database/customerRepository";
import {createEntity} from "@/components/admin/entity/action/createEntityAction";
import {createEntityModel} from "@/components/admin/entity/temporaryLocation";

export async function createCustomer(data: Customer, company: string) {
    return createEntity(createEntityModel(data), company)
        .then(entity => saveCustomer({...data, entityId: entity.id}, company));
}
