"use server"

import {updateEntity} from "@/components/admin/entity/_database/entityRepository";
import {Entity} from "@/components/admin/entity/entity";

export async function updateEntityAction(entity: Entity, company: string) {
    return await updateEntity(entity, company);
}
