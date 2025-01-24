import React from 'react';
import {Entity} from './entity';
import {useLocale} from "next-intl";

interface EntityTableProps {
    entities: Entity[];
    entityType: any;  // We gaan entityType meegeven om de velden dynamisch te tonen
    onEdit: (entity: Entity) => void;
    onDelete: (entity: Entity) => void;
}

export const EntityTable: React.FC<EntityTableProps> = ({entities, entityType, onEdit, onDelete}) => {
    const locale = useLocale();
    if (entities.length === 0) {
        return <div>{'Er zijn geen entiteiten beschikbaar.'}</div>;
    }

    const fieldKeys = Object.keys(entityType?.fields || []);

    function getTranslationForLocale(locale: string) {
        const languageCode = locale.split('-')[0];
        const translationKey = Object.keys(entityType?.translations).find(key => key.startsWith(languageCode));
        return translationKey ? entityType?.translations[translationKey] : entityType?.translations['en-US'];  // Fallback naar Engels als geen vertaling gevonden
    }

    return (
        <table className="min-w-full bg-cyan-950 text-white">
            <thead>
            <tr>
                {fieldKeys.map((fieldKey) => {
                    const fieldLabel = getTranslationForLocale(locale)[fieldKey] || fieldKey;
                    return (
                        <th key={fieldKey} className="px-4 py-2 text-left">
                            {fieldLabel}
                        </th>
                    );
                })}
                <th className="px-4 py-2 text-left">Acties</th>
            </tr>
            </thead>
            <tbody>
            {entities.map((entity) => (
                <tr key={entity.id}
                    className="border-b border-cyan-800 hover:bg-cyan-700"
                >

                    {fieldKeys.map((fieldKey) => (
                        <td key={fieldKey} className="px-4 py-2">
                            {entity.fieldValues[fieldKey] || 'N/A'}
                        </td>
                    ))}

                    <td className="px-4 py-2">
                        <button
                            onClick={() => onEdit(entity)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                        >
                            Bewerken
                        </button>
                        <button
                            onClick={() => onDelete(entity)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Verwijderen
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};
