"use server"
import {findEntityTypesByCompany} from "@/components/admin/entity-type/_database/entityTypeRepository";

export async function getEntityTypes(company: string) {
    return findEntityTypesByCompany(company);
}
