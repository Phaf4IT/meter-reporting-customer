"use server"
import {updateCustomer as update} from "@/components/admin/customer/_database/customerRepository"
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";

export async function updateCustomer(data: ModifiableCustomer, company: string) {
    return update(data, company);
}