"use server"
import {Customer} from "@/app/admin/customer/customer";
import {updateCampaign as update} from "@/app/api/admin/customer/_database/customerRepository"

export async function updateCustomer(data: Customer, company: string) {
    return update(data, company)
}