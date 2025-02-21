import {auth} from "@/auth";
import {findNonActiveCustomers} from "@/components/admin/customer/_database/nonActiveCustomerRepository";

export async function getNonActiveCustomersAction() {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findNonActiveCustomers(company);
}
