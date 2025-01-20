import {auth} from "@/auth";
import {findCustomersByIds} from "@/components/admin/customer/_database/customerRepository";

export async function findCustomers(ids: string[]) {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findCustomersByIds(ids, company);
}