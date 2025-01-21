"use server"

import {saveEntity} from "@/components/admin/entity/_database/entityRepository";
import {Entity} from "@/components/admin/entity/entity";

export async function createEntity(entity: Entity, company: string) {
    return await saveEntity(entity, company);
}
