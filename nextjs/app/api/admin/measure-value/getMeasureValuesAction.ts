"use server"
import {auth} from "@/auth";
import {findMeasureValues} from "@/app/api/admin/measure-value/_database/measureValueRepository";


export async function getMeasureValues() {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findMeasureValues(company);
}
