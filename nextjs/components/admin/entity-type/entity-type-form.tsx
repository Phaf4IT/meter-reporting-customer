import React, {useCallback, useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {emptyEntityType, EntityType, Field} from "@/components/admin/entity-type/entityType";
import {Logger} from "@/lib/logger";
import "flag-icons/css/flag-icons.min.css";
import MultiSelect from "@/components/admin/multi-select";
import EntityFields from "@/components/admin/entity-type/form/entity-fields";
import {useToaster} from "@/components/admin/toast-context";

interface EntityTypeFormProps {
    isNew: boolean;
    entityType?: EntityType;  // Dit kan null zijn voor nieuw
    onClose: (entityType?: EntityType) => void;
    onSubmit: (entityType: EntityType, isNew: boolean) => Promise<void>;
}

interface ValidationErrors {
    name?: string;
    newField?: string;

    [key: string]: string | undefined;
}

interface Locale {
    value: string;
    name: string;
}

const availableLocales: Locale[] = [
    {value: 'en-US', name: 'English'},
    {value: 'nl-NL', name: 'Nederlands'},
    {value: 'de-DE', name: 'Deutsch'},
    {value: 'fr-FR', name: 'Français'}];

export const EntityTypeForm: React.FC<EntityTypeFormProps> = ({entityType, onClose, isNew, onSubmit}) => {
    const [formData, setFormData] = useState<EntityType>(entityType || {name: '', fields: {}, translations: {}});
    const t = useTranslations('admin.entity-type');
    const [isSaving, setIsSaving] = useState(false);
    const [newFieldValue, setFieldValue] = useState<string>('');
    const toaster = useToaster();
    // State om te controleren of het formulier gewijzigd is
    const [isDirty, setIsDirty] = useState<boolean>(false);

    function getInitialState() {
        if (entityType) {
            const selectedLocales = []
            for (const localeValue of Object.keys(entityType.translations)) {
                const selectedLocale = availableLocales.find(l => l.value === localeValue);
                if (selectedLocale) {
                    selectedLocales.push(selectedLocale);
                }
            }
            return selectedLocales;
        }
        return [];
    }

    const [selectedLocales, setSelectedLocales] = useState<Locale[]>(getInitialState());
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});


    const validate = useCallback(() => {
        const errors: ValidationErrors = {};

        // Naam validatie
        if (formData?.name && formData?.fields[formData?.name]) {
            errors.name = t('nameExists');
        }

        // Foutvalidatie voor veldnaam
        if (newFieldValue && formData?.fields[newFieldValue]) {
            errors.newField = t('fieldExists');
        }

        // Foutvalidatie voor veldnaam
        if (newFieldValue && formData?.name === newFieldValue) {
            errors.newField = t('sameAsEntityName');
        }

        // Voeg andere validaties toe zoals vereist, lengte, etc.
        if (!formData?.name) {
            errors.name = t('nameRequired');
        }
        return errors;
    }, [formData?.fields, formData?.name, newFieldValue, t]);

    useEffect(() => {
        if (!isDirty) return;  // Voer validatie alleen uit als formulier is aangepast
        setValidationErrors(validate());
    }, [formData, newFieldValue, t, isDirty, validate]);

    // Voeg een veld toe
    const handleAddField = () => {
        if (newFieldValue) {
            // Voeg veld toe
            setFormData((prev) => {
                const updatedData = {...prev!};
                updatedData.fields = {
                    ...updatedData.fields,
                    [newFieldValue!]: {type: 'text', required: false},
                };
                return updatedData;
            });
            setFieldValue('');
            setIsDirty(true);  // Formulier is veranderd
        }
    };

    const handleRemoveField = (fieldKey: string) => {
        setFormData((prev) => {
            const newFields = {...prev!.fields};
            delete newFields[fieldKey];
            return {...prev!, fields: newFields};
        });
        setIsDirty(true);  // Formulier is veranderd
    };

    const handleFieldChange = (fieldKey: string, field: Field) => {
        setFormData((prev) => ({
            ...prev!,
            fields: {...prev!.fields, [fieldKey]: field},
        }));
        setIsDirty(true);  // Formulier is veranderd
    };

    // Dynamisch vertalingen toevoegen
    const handleTranslationChange = (fieldKey: string, locale: string, value: string) => {
        setFormData((prev) => {
            const newTranslations = {...prev!.translations};
            if (!newTranslations[locale]) newTranslations[locale] = {};
            newTranslations[locale][fieldKey] = value;
            return {...prev!, translations: newTranslations};
        });
        setIsDirty(true);  // Formulier is veranderd
    };


    const handleLocaleChange = (selected: Locale[]) => {
        setSelectedLocales((prev) => {
            for (const locale of prev) {
                if (!selected.find(s => s === locale)) {
                    handleRemoveTranslations(locale.value);
                }
            }
            for (const locale of selected) {
                if (!prev.find(s => s === locale)) {
                    handleAddTranslations(locale.value);
                }
            }
            setIsDirty(true);  // Formulier is veranderd
            return selected;
        });
    };

    // Dynamisch nieuwe vertalingen toevoegen voor velden
    const handleAddTranslations = (locale: string) => {
        if (!formData?.translations[locale]) {
            Object.keys(formData?.fields || {}).map((fieldKey) => {
                handleTranslationChange(fieldKey, locale, fieldKey);
            });
            handleTranslationChange(formData!.name, locale, formData!.name);
        }
    };

    // Verwijder een taal voor een veld
    const handleRemoveTranslations = (locale: string) => {
        if (formData?.translations[locale]) {
            setFormData((prev) => {
                const newTranslations = {...prev!.translations};
                if (newTranslations[locale]) {
                    delete newTranslations[locale];
                }
                return {...prev!, translations: newTranslations};
            });
        }
    };

    // Verstuur het formulier
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDirty(true);
        const errors = validate();

        // Als er fouten zijn, verstuur het formulier niet
        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsSaving(true);

        try {
            await onSubmit(formData!, isNew);
            toaster.showToaster(t('entityTypeSaved'), 'success');
            cancel(); // Sluit formulier
        } catch (err: any) {
            Logger.error("Not saved,", err);
            toaster.showToaster(t('errorSavingEntityType'), 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const setEntityTypeName = (name: string) => {
        setFormData((prev) => ({...prev!, name: name}));
        setIsDirty(true);  // Formulier is veranderd
    }

    const cancel = () => {
        setFormData(() => emptyEntityType());
        setValidationErrors({})
        setFieldValue('')
        setIsDirty(false);  // Reset dirty state
        onClose();
    }

    const handleAddOption = (fieldKey: string) => {
        const newOption = prompt(t('enterNewOption'));
        if (newOption) {
            setFormData((prev) => {
                // Maak een diepe kopie van de velden om referentieproblemen te voorkomen
                const updatedFields = structuredClone(prev!.fields) || {}; // of JSON.parse(JSON.stringify(prev!.fields))
                const field = updatedFields[fieldKey];

                if (field.type === 'select' && !field.options?.includes(newOption)) {
                    // Voeg de optie toe als deze nog niet bestaat
                    field.options = [...(field.options || []), newOption];
                }

                return {...prev!, fields: updatedFields};
            });
            setIsDirty(true); // Formulier is veranderd
        }
    };


    const handleRemoveOption = (fieldKey: string, option: string) => {
        setFormData((prev) => {
            const updatedFields = {...prev!.fields};
            const field = updatedFields[fieldKey];

            if (field.type === 'select') {
                field.options = field.options?.filter(opt => opt !== option) || [];
            }

            return {...prev!, fields: updatedFields};
        });
        setIsDirty(true); // Formulier is veranderd
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-3xl font-bold text-cyan-500">{entityType ? t('editEntityType') : t('addEntityType')}</h1>
            <label className="block text-lg font-semibold">{t('translations')}</label>
            <MultiSelect
                availableOptions={availableLocales}
                selectedOptions={selectedLocales}
                onChange={handleLocaleChange}
                getOptionLabel={(locale: any) => locale.name}
                getOptionValue={(locale: any) => locale.name}
                getOptionIcon={(locale: any) => <span
                    className={`fi fi-${locale.value.split('-')[1].toLowerCase()}`}></span>}
            />

            {/* Naam van het EntityType */}
            <div className="space-y-2">
                <label className="block text-lg font-semibold">{t('name')}</label>
                <input
                    type="text"
                    value={formData?.name || ''}
                    onChange={(e) => setEntityTypeName(e.target.value)}
                    className={`appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400 ${validationErrors.name ? 'border-red-500' : ''}`}
                    aria-invalid={validationErrors.name ? "true" : "false"}
                />
                {validationErrors.name && <p className="text-red-500 mt-4">{validationErrors.name}</p>}
                {Object.keys(formData!.translations).map((locale) => (
                    <div key={locale} className="space-y-2">
                        <label className="block">{locale}</label>
                        <input
                            type="text"
                            value={formData?.translations[locale]?.[formData?.name] || ''}
                            onChange={(e) => handleTranslationChange(formData!.name, locale, e.target.value)}
                            className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                            required
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">{t('fields')}</h2>

                <div className="flex space-x-4 items-center">
                    <input
                        type="text"
                        value={newFieldValue || ''}
                        onChange={(e) => setFieldValue(e.target.value)}
                        className={`appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400 ${validationErrors.newField ? 'border-red-500' : ''}`}
                        aria-invalid={validationErrors.newField ? "true" : "false"}
                    />
                    <button
                        type="button"
                        onClick={handleAddField}
                        className="px-4 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none"
                    >
                        {t('addField')}
                    </button>
                </div>
                {validationErrors.newField && <p className="text-red-500 mt-4">{validationErrors.newField}</p>}

                <EntityFields
                    fields={formData?.fields || {}}
                    validationErrors={validationErrors}
                    handleFieldChange={handleFieldChange}
                    handleRemoveField={handleRemoveField}
                    handleAddOption={handleAddOption}
                    handleRemoveOption={handleRemoveOption}
                    handleTranslationChange={handleTranslationChange}
                    translations={formData?.translations || {}}
                />

            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={cancel}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                >
                    {t('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                >
                    {isSaving ? t('saving') : t('save')}
                </button>
            </div>
        </form>
    );
};
