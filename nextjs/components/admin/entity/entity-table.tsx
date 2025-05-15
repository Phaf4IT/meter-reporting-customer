'use client';
import React from 'react';
import {Entity} from './entity';
import {useLocale} from "next-intl";
import {EntityType} from "@/components/admin/entity-type/entityType";

interface EntityTableProps {
    entities: Entity[];
    entityType?: EntityType;
    onEdit: (entity: Entity) => void;
    onDelete: (entity: Entity) => void;
}

export const EntityTable: React.FC<EntityTableProps> = ({entities, entityType, onEdit, onDelete}) => {
    const locale = useLocale();

    function getTranslationForLocale(locale: string) {
        const languageCode = locale.split('-')[0];
        const translationKey = entityType ? Object.keys(entityType?.translations).find(key => key.startsWith(languageCode)) : undefined;
        return translationKey ? entityType?.translations[translationKey] : entityType?.translations['en-US'];
    }

    const translations = getTranslationForLocale(locale);
    const fieldKeys = Object.keys(entityType?.fields || []);

    if (entities.length === 0) {
        return <div className="text-white">Er zijn geen entiteiten beschikbaar.</div>;
    }

    return (
        <div className="flex flex-col space-y-2 w-full bg-cyan-950 text-white p-4 rounded">
            {/* Headers */}
            <div className="flex justify-between font-semibold border-b border-cyan-700 pb-2">
                {fieldKeys.map((fieldKey) => {
                    const label = translations?.[fieldKey] || fieldKey;
                    return (
                        <div key={fieldKey} className="flex-1 px-2">
                            {label}
                        </div>
                    );
                })}
                <div className="w-[120px] text-right pr-2">Acties</div>
            </div>

            {/* Rows */}
            {entities.map((entity) => (
                <div
                    key={entity.id}
                    className="flex justify-between items-center border-b border-cyan-800 py-2 hover:bg-cyan-800 transition"
                >
                    {fieldKeys.map((fieldKey) => {
                        const rawValue = entity.fieldValues[fieldKey] || 'N/A';
                        const value = translations?.[rawValue] || rawValue;
                        return (
                            <div key={fieldKey} className="flex-1 px-2 break-words">
                                {value}
                            </div>
                        );
                    })}
                    <div className="w-[120px] flex justify-end space-x-2 pr-2">
                        <button
                            onClick={() => onEdit(entity)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        >
                            Bewerken
                        </button>
                        <button
                            onClick={() => onDelete(entity)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                            Verwijderen
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
