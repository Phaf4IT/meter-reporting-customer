"use server"
import {findEntityTypeByCompanyAndName} from "@/components/admin/entity-type/_database/entityTypeRepository";

export async function getEntityType(type: string, company: string) {
    return findEntityTypeByCompanyAndName(type, company);
}
