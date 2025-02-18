import React from 'react';
import {Field} from "@/components/admin/entity-type/entityType"; // Zorg ervoor dat je juiste pad gebruikt
import {useTranslations} from 'next-intl';

interface EntityFieldsProps {
    fields: { [key: string]: Field };
    validationErrors: { [key: string]: string | undefined };
    handleFieldChange: (fieldKey: string, field: Field) => void;
    handleRemoveField: (fieldKey: string) => void;
    handleAddOption: (fieldKey: string) => void;
    handleRemoveOption: (fieldKey: string, option: string) => void;
    handleTranslationChange: (fieldKey: string, locale: string, value: string) => void;
    translations: { [locale: string]: { [fieldKey: string]: string } };
}

const EntityFields: React.FC<EntityFieldsProps> = ({
                                                       fields,
                                                       handleFieldChange,
                                                       handleRemoveField,
                                                       handleAddOption,
                                                       handleRemoveOption,
                                                       handleTranslationChange,
                                                       translations,
                                                   }) => {
    const t = useTranslations('admin.entity-type');

    const handleAddOptionWithTranslation = (fieldKey: string) => {
        handleAddOption(fieldKey);

        Object.keys(translations).forEach((locale) => {
            if (!translations[locale][fieldKey]) {
                translations[locale][fieldKey] = '';
            }
            handleTranslationChange(fieldKey, locale, translations[locale][fieldKey]);
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.keys(fields || {}).map((fieldKey) => {
                const field = fields[fieldKey];
                return (
                    <div key={fieldKey} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block font-bold text-xl">{t('field')}: {fieldKey}</label>
                            <label className="block">{t('fieldType')}</label>
                            <select
                                value={field.type}
                                onChange={(e) => handleFieldChange(fieldKey, {
                                    ...field,
                                    type: e.target.value as Field['type'],
                                })}
                                className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                            >
                                <option value="text">{t('text')}</option>
                                <option value="numeric">{t('numeric')}</option>
                                <option value="boolean">{t('boolean')}</option>
                                <option value="date">{t('date')}</option>
                                <option value="text[]">{t('textArray')}</option>
                                <option value="select">{t('select')}</option>
                            </select>
                        </div>

                        {field.type === 'select' && (
                            <div>
                                <label className="block">{t('options')}</label>
                                <div className="space-y-2">
                                    {(field.options || []).map((option, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span>{option}</span>
                                            <div>
                                                {/* Vertalingen voor de optie */}
                                                {Object.keys(translations).map((locale) => (
                                                    <div key={locale} className="space-y-2">
                                                        <label className="block">{locale}</label>
                                                        <input
                                                            type="text"
                                                            value={translations[locale]?.[option] || ''}
                                                            onChange={(e) => {
                                                                const updatedTranslation = e.target.value;
                                                                handleTranslationChange(option, locale, updatedTranslation);
                                                            }}
                                                            className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(fieldKey, option)}
                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                            >
                                                {t('removeOption')}
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleAddOptionWithTranslation(fieldKey)}
                                        className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none"
                                    >
                                        {t('addOption')}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block">{t('required')}</label>
                            <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => handleFieldChange(fieldKey, {
                                    ...field,
                                    required: e.target.checked,
                                })}
                                className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Dynamisch vertalingen toevoegen voor dit veld */}
                        {Object.keys(translations).map((locale) => (
                            <div key={locale} className="space-y-2">
                                <label className="block">{locale}</label>
                                <input
                                    type="text"
                                    value={translations[locale]?.[fieldKey] || ''}
                                    onChange={(e) => handleTranslationChange(fieldKey, locale, e.target.value)}
                                    className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                    required
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => handleRemoveField(fieldKey)}
                            className="text-red-500 hover:text-red-700 focus:outline-none col-span-2"
                        >
                            {t('removeField')}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default EntityFields;
