"use server"
import {Customer} from "@/app/admin/customer/customer";
import {deleteCustomer as remove} from "@/app/api/admin/customer/_database/customerRepository"
import {saveCustomer} from "@/app/api/admin/customer/_database/nonActiveCustomerRepository"

export async function deleteCustomer(data: Customer, company: string) {
    return saveCustomer(data, company)
        .then(() => remove(data, company));
}