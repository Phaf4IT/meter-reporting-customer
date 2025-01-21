"use server"
import {EntityType} from "@/components/admin/entity-type/entityType";
import {deleteEntityType} from "@/components/admin/entity-type/_database/entityTypeRepository";

export async function removeEntityType(entityType: EntityType, company: string) {
    return deleteEntityType(entityType, company);
}
