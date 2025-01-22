"use server"

import {findEntityByCompanyAndId} from "@/components/admin/entity/_database/entityRepository";

export async function getEntityById(id: string, company: string) {
    return findEntityByCompanyAndId(id, company);
}
