"use server"
import {auth} from "@/auth";
import {findMeasureValues} from "@/components/admin/measure-value/_database/measureValueRepository";


export async function getMeasureValues() {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findMeasureValues(company);
}
