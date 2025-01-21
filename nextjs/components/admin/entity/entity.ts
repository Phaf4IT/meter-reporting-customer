export interface Entity {
    id?: string;
    entityType: string;
    fieldValues: Record<string, any>;
}

export function entityFromJson(json: any): Entity {
    return {
        id: json.id,
        entityType: json.entityType,
        fieldValues: json.fieldValues,
    }
}