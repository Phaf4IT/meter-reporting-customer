import React from 'react';
import {useTranslations} from "next-intl";
import {EntityType} from "@/components/admin/entity-type/entityType";

interface EntityTypeTableProps {
    entityTypes: EntityType[];  // Array van EntityTypes
    onEdit: (entityTypeName: string) => void;  // Functie om een EntityType te bewerken
    onDelete: (entityTypeName: EntityType) => void;  // Functie om een EntityType te bewerken
}

export const EntityTypeTable: React.FC<EntityTypeTableProps> = ({entityTypes, onEdit, onDelete}) => {
    const t = useTranslations('admin.entity-type');
    if (entityTypes.length === 0) {
        return <div>{'Er zijn geen EntityTypes beschikbaar.'}</div>;
    }

    return (
        <table className="min-w-full bg-cyan-950 text-white">
            <thead>
            <tr>
                <th className="px-4 py-2 text-left">{t('name')}</th>
                <th className="px-4 py-2 text-left">Velden</th>
                <th className="px-4 py-2 text-left">{t('actions')}</th>
            </tr>
            </thead>
            <tbody>
            {entityTypes.map((entityType) => (
                <tr key={entityType.name} className="border-b border-cyan-800 hover:bg-cyan-700">
                    <td className="px-4 py-2">{entityType.name}</td>
                    <td className="px-4 py-2">{Object.keys(entityType.fields).join(', ')}</td>
                    <td className="px-4 py-2">
                        <button
                            onClick={() => onEdit(entityType.name)}  // Klik om te bewerken
                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                        >
                            {t('editEntityType')}
                        </button>
                        <button
                            onClick={() => onDelete(entityType)}  // Klik om te bewerken
                            className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                        >
                            {t('deleteEntityType')}
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};
