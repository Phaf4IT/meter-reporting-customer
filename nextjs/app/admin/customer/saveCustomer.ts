import {Customer} from "@/app/admin/customer/getCustomer";

export async function saveCustomer(customer: Customer): Promise<Customer> {
    // TODO get customers from xata table...
    console.log(`${customer} has been saved...`)
    return customer
}