"use server"
import {Customer} from "@/components/admin/customer/customer";
import {updateCustomer as update} from "@/components/admin/customer/_database/customerRepository"
import {updateEntity} from "@/components/admin/entity/_database/entityRepository";
import {createEntityModel} from "@/components/admin/entity/temporaryLocation";

export async function updateCustomer(data: Customer, company: string) {
    return updateEntity(createEntityModel(data), company)
        .then(() => update(data, company));
}