import {EntityType} from "@/components/admin/entity-type/entityType";

export interface Entity {
    id?: string;
    entityTypeName: string;
    entityType?: EntityType;
    fieldValues: Record<string, any>;
}

export function entityFromJson(json: any): Entity {
    return {
        id: json.id,
        entityTypeName: json.entityTypeName,
        entityType: json.entityType,
        fieldValues: json.fieldValues,
    }
}