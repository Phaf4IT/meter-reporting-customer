"use server"

import {Entity} from "@/components/admin/entity/entity";
import {deleteEntity} from "@/components/admin/entity/_database/entityRepository";

export async function removeEntity(entity: Entity, company: string) {
    return deleteEntity(entity, company);
}
