"use server"

import {findEntitiesByCompanyAndType} from "@/components/admin/entity/_database/entityRepository";

export async function getEntitiesByType(type: string, company: string) {
    return findEntitiesByCompanyAndType(type, company);
}
