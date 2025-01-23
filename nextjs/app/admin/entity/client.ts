import {Entity, entityFromJson} from "@/components/admin/entity/entity";

export async function getEntity(entityId: string): Promise<Entity> {
    const response = await fetch(`/api/admin/entity/${entityId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch entity: ${response.status}`);
    }

    const entity = await response.json();
    return entityFromJson(entity);
}

export async function saveEntity(entity: Entity): Promise<Entity> {
    const response = await fetch('/api/admin/entity', {
        method: entity.id ? 'PUT' : 'POST',  // PUT als er een id is, anders POST
        body: JSON.stringify(entity),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to save entity: ${response.status}`);
    }

    const savedEntity = await response.json();
    return entityFromJson(savedEntity);
}

export async function getEntities(entityTypeName: string) {
    const response = await fetch(`/api/admin/entity?type=${entityTypeName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch entities: ${response.statusText}`);
    }
    return await response.json();
}

export async function getAllEntities() {
    const response = await fetch(`/api/admin/entity`);
    if (!response.ok) {
        throw new Error(`Failed to fetch entities: ${response.statusText}`);
    }
    return await response.json();
}

export async function deleteEntity(entity: Entity) {
    const response = await fetch(`/api/admin/entity`, {
        method: 'DELETE',
        body: JSON.stringify(entity),
    });
    if (!response.ok) {
        throw new Error(`Failed to delete entity: ${response.statusText}`);
    }
    return await response.json();
}