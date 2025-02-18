export interface EntityType {
    name: string;
    fields: Record<string, Field>;
    translations: Record<string, Record<string, string>>;
}

export function entityTypeFromJson(json: any): EntityType {
    return {
        name: json.name,
        fields: json.fields,
        translations: json.translations,
    }
}

export interface Field {
    type: 'text' | 'boolean' | 'numeric' | 'date' | 'text[]' | 'select';
    required: boolean;
    options?: string[]
}

export function getTranslationForLocale(entityType: EntityType, locale: string) {
    const languageCode = locale.split('-')[0];
    const translationKey = Object.keys(entityType.translations).find(key => key.startsWith(languageCode));
    return translationKey ? entityType?.translations[translationKey] : entityType.translations['en-US'];  // Fallback naar Engels als geen vertaling gevonden
}

export function emptyEntityType(): EntityType {
    return {name: '', fields: {}, translations: {}}
}