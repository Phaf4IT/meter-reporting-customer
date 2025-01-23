"use server"
import {deleteCustomer as remove} from "@/components/admin/customer/_database/customerRepository"
import {saveCustomer} from "@/components/admin/customer/_database/nonActiveCustomerRepository"
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";

export async function deleteCustomer(data: ModifiableCustomer, company: string) {
    return saveCustomer(data, company)
        .then(() => remove(data, company));
}