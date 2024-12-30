"use server"
import {Customer} from "@/components/admin/customer/customer";
import {saveCustomer} from "@/components/admin/customer/_database/customerRepository";

export async function createCustomer(data: Customer, company: string) {
    return saveCustomer(data, company)
}