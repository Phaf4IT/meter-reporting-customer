"use server"
import {Customer} from "@/components/admin/customer/customer";
import {deleteCustomer as remove} from "@/components/admin/customer/_database/customerRepository"
import {saveCustomer} from "@/components/admin/customer/_database/nonActiveCustomerRepository"

export async function deleteCustomer(data: Customer, company: string) {
    return saveCustomer(data, company)
        .then(() => remove(data, company));
}