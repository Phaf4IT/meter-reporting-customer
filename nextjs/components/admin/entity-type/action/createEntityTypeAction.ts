"use server"

import {EntityType} from "@/components/admin/entity-type/entityType";
import {saveEntityType} from "@/components/admin/entity-type/_database/entityTypeRepository";

export async function createEntityType(entityType: EntityType, company: string) {
    return await saveEntityType(entityType, company);
}
