"use server"
import {saveCustomer} from "@/components/admin/customer/_database/customerRepository";
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";

export async function createCustomer(data: ModifiableCustomer, company: string) {
    return saveCustomer(data, company);
}
