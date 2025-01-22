"use server"

import {findEntitiesByCompany} from "@/components/admin/entity/_database/entityRepository";

export async function getEntities(company: string) {
    return findEntitiesByCompany(company);
}
