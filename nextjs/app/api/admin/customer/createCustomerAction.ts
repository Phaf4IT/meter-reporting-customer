"use server"
import {Customer} from "@/app/admin/customer/customer";
import {saveCustomer} from "@/app/api/admin/customer/_database/customerRepository";

export async function createCustomer(data: Customer, company: string) {
    return saveCustomer(data, company)
}