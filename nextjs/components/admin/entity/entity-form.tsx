import React, {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Entity} from './entity'; // Zorg ervoor dat deze de juiste interface heeft
import {saveEntity} from '@/app/admin/entity/client';
import {EntityType} from "@/components/admin/entity-type/entityType";

interface EntityFormProps {
    entity?: Entity | null;  // Kan null zijn voor nieuwe entiteit
    onClose: () => void;
    entityType?: EntityType;
}

export const EntityForm: React.FC<EntityFormProps> = ({entityType, entity, onClose}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isSaving, setIsSaving] = useState(false);
    const t = useTranslations('admin.entity');
    const locale = useLocale();

    // Haal het EntityType op, indien het nog niet geladen is
    useEffect(() => {
        if (entity) {
            setFormData(entity.fieldValues);  // Vul het formulier met bestaande waarden voor bewerking
        } else {
            setFormData({});  // Lege velden voor nieuwe entiteit
        }
    }, [entity]);

    // Handelt de wijziging van inputvelden af
    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}));
    };

    function getTranslationForLocale(locale: string) {
        const languageCode = locale.split('-')[0];
        const translationKey = Object.keys(entityType?.translations || []).find(key => key.startsWith(languageCode));
        return translationKey ? entityType?.translations[translationKey] : entityType?.translations['en-US'];
    }

    // Handelt de formulierverzending af
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const newEntity: Entity = {
            entityTypeName: entityType!.name,
            fieldValues: formData,
            id: entity?.id
        };

        try {
            await saveEntity(newEntity);
            alert(t('entitySaved')); // Succesmelding na opslaan
            onClose(); // Sluit het formulier na opslaan
        } catch (err) {
            console.error('Fout bij opslaan', err);
            alert(t('errorSavingEntity')); // Foutmelding bij falen
        } finally {
            setIsSaving(false);
        }
    };

    // Als het entityType nog niet geladen is, toon "loading"
    if (!entityType) return <div>{t('loading')}</div>;


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold">{entity ? t('editEntity') : t('addEntity')}</h1>

            {/* Dynamisch genereren van formulier velden op basis van entityType */}
            {Object.keys(entityType.fields).map((fieldKey) => {
                const field = entityType.fields[fieldKey];
                const fieldType = field.type;
                const isRequired = field.required;
                const fieldLabel = getTranslationForLocale(locale)![fieldKey] || fieldKey;

                switch (fieldType) {
                    case 'text':
                        return (
                            <div key={fieldKey}>
                                <label>{fieldLabel}</label>
                                <input
                                    type="text"
                                    required={isRequired}
                                    value={formData[fieldKey] || ''}
                                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                    className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        );

                    case 'text[]':
                        return (
                            <div key={fieldKey}>
                                <label>{fieldLabel}</label>
                                <textarea
                                    value={(formData[fieldKey] || []).join('\n')}
                                    required={isRequired}
                                    onChange={(e) => handleInputChange(fieldKey, e.target.value.split('\n'))}
                                    className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        );

                    case 'numeric':
                        return (
                            <div key={fieldKey}>
                                <label>{fieldLabel}</label>
                                <input
                                    type="number"
                                    required={isRequired}
                                    value={formData[fieldKey] || ''}
                                    onChange={(e) => handleInputChange(fieldKey, parseFloat(e.target.value))}
                                    className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        );

                    case 'boolean':
                        return (
                            <div key={fieldKey}>
                                <label>{fieldLabel}</label>
                                <input
                                    type="checkbox"
                                    required={isRequired}
                                    checked={formData[fieldKey] || false}
                                    onChange={(e) => handleInputChange(fieldKey, e.target.checked)}
                                    className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        );

                    case 'date':
                        return (
                            <div key={fieldKey}>
                                <label>{fieldLabel}</label>
                                <input
                                    type="date"
                                    required={isRequired}
                                    value={formData[fieldKey] || ''}
                                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                    className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        );

                    default:
                        return null;
                }
            })}

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                    {t('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    {isSaving ? t('saving') : t('save')}
                </button>
            </div>
        </form>
    );
};
