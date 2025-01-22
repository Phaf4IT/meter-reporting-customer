export interface EntityType {
    name: string;
    fields: Record<string, string>;
    translations: Record<string, Record<string, string>>;
}

export function entityTypeFromJson(json: any): EntityType {
    return {
        name: json.name,
        fields: json.fields,
        translations: json.translations,
    }
}