"use server"
import {auth} from "@/auth";
import {findCustomers} from "@/components/admin/customer/_database/customerRepository";


export async function getCustomers() {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findCustomers(company);
}
