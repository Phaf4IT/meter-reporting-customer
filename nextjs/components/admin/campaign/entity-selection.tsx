import React, { useState } from "react";
import { Entity } from "@/components/admin/entity/entity";
import { getTranslationForLocale } from "@/components/admin/entity-type/entityType";
import { useLocale } from "next-intl";

interface EntitySelectionProps {
    t: (key: string) => string;
    entities: Entity[];
    selectedEntities: Entity[];
    setSelectedEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
}

const EntitySelection = ({
                             t,
                             entities,
                             selectedEntities,
                             setSelectedEntities,
                         }: EntitySelectionProps) => {
    const locale = useLocale();
    const [query, setQuery] = useState('');

    // Filter de entiteiten op basis van de zoekterm
    const filteredEntities = query === ''
        ? entities
        : entities.filter(entity =>
            Object.values(entity.fieldValues).some(value =>
                value.toLowerCase().includes(query.toLowerCase())
            )
        );

    const toggleEntitySelection = (entity: Entity) => {
        setSelectedEntities((prev: Entity[]) =>
            prev.includes(entity)
                ? prev.filter((c) => c !== entity)
                : [...prev, entity]
        );
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">{t('entity')}</h2>

            {/* Zoekbalk */}
            <div className="mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-700 text-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder={t('search')}
                />
            </div>

            {/* Scrollbare lijst van entiteiten */}
            <div className="space-y-3 max-h-72 overflow-y-auto">
                {filteredEntities.length === 0 && (
                    <p className="text-gray-400">{t('noResults')}</p>
                )}
                {filteredEntities.map((entity: Entity) => (
                    <div key={entity.id} className="flex items-center space-x-3 bg-gray-700 p-2 rounded-lg hover:bg-gray-600">
                        <input
                            type="checkbox"
                            id={entity.id}
                            checked={!!selectedEntities.find((c: Entity) => c.id === entity.id)}
                            onChange={() => toggleEntitySelection(entity)}
                            className="form-checkbox h-5 w-5 text-cyan-500"
                        />
                        <label htmlFor={entity.id} className="text-white w-full">
                            {Object.keys(entity.entityType?.fields || []).map((fieldKey) => {
                                const fieldLabel = getTranslationForLocale(entity.entityType!, locale)[fieldKey] || fieldKey;
                                return (
                                    <p key={fieldKey} className="truncate">
                                        <span className="font-semibold">{fieldLabel}:</span> {entity.fieldValues[fieldKey] || 'N/A'}
                                    </p>
                                )
                            })}
                        </label>
                    </div>
                ))}
            </div>

            {/* Select / Reset buttons */}
            <div className="mt-6 flex space-x-4">
                <button
                    type="button"
                    onClick={() => setSelectedEntities(entities)}
                    className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    {t('selectAll')}
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedEntities([])}
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    {t('reset')}
                </button>
            </div>
        </div>
    );
};

export default EntitySelection;
