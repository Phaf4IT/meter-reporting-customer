import {EntityType, entityTypeFromJson} from "@/components/admin/entity-type/entityType";

export async function getEntityType(entityTypeName: string): Promise<EntityType> {
    const response = await fetch(`/api/admin/entity-type/?type=${entityTypeName}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch entity type: ${response.status}`);
    }

    const entityType = await response.json();
    return entityTypeFromJson(entityType);
}

export async function getEntityTypes(): Promise<EntityType[]> {
    const response = await fetch(`/api/admin/entity-type/`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch entity type: ${response.status}`);
    }

    const entityType: any[] = await response.json();
    return entityType.map(value => entityTypeFromJson(value));
}