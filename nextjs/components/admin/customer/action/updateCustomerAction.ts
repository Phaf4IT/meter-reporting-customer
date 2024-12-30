"use server"
import {Customer} from "@/components/admin/customer/customer";
import {updateCustomer as update} from "@/components/admin/customer/_database/customerRepository"

export async function updateCustomer(data: Customer, company: string) {
    return update(data, company)
}