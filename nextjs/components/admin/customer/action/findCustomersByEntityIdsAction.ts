import {auth} from "@/auth";
import {findCustomersByEntityIds} from "@/components/admin/customer/_database/customerRepository";

export async function findCustomersByEntityIdsAction(ids: string[]) {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findCustomersByEntityIds(ids, company);
}