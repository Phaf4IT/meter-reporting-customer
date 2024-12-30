import React, {useState} from 'react';
import {useTranslations} from 'next-intl';
import {MeasureValue, MeasureValueType} from '@/components/admin/measure-value/measureValue';
import 'rc-dialog/assets/index.css';
import '../../dialog-styles.css';
import TranslationsForm from './translations-form';
import ToggleSwitch from '@/components/toggle-switch'; // Import the ToggleSwitch component

export default function MeasureValueForm({
                                             measureValue,
                                             isNew,
                                             onSave,
                                             onCancel,
                                         }: {
    measureValue: MeasureValue;
    isNew: boolean;
    onSave: (measureValue: MeasureValue, isNew: boolean) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<MeasureValue>({...measureValue});
    const [error, setError] = useState<string | null>(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const t = useTranslations('admin.measureValue');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, isNew);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof MeasureValue) => {
        setFormData({
            ...formData,
            [field]: e.target.value,
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof MeasureValue) => {
        setFormData({
            ...formData,
            [field]: e.target.value,
        });
    };

    const handleAddTranslation = (locale: string, value: string) => {
        const existingTranslation = formData.translations.some(
            (translation) => translation.locale === locale
        );

        if (existingTranslation) {
            setError('Deze locale is al toegevoegd.');
            setIsDialogVisible(true);
            return;
        }

        setFormData({
            ...formData,
            translations: [
                ...formData.translations,
                {locale, value},
            ],
        });
    };

    const handleRemoveTranslation = (locale: string) => {
        setFormData({
            ...formData,
            translations: formData.translations.filter((t) => t.locale !== locale),
        });
    };

    const handleToggleChange = () => {
        setFormData({...formData, isEditable: !formData.isEditable});
    };

    const handleCloseDialog = () => {
        setIsDialogVisible(false);
        setError(null);
    };

    return (
        <form onSubmit={handleSubmit}
              className="w-full max-w-lg bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2" htmlFor="name">
                        {t('name')}
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange(e, 'name')}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                        disabled={!isNew}
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2" htmlFor="unit">
                        {t('unit')}
                    </label>
                    <input
                        type="text"
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => handleChange(e, 'unit')}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>
            </div>

            <TranslationsForm
                translations={formData.translations}
                onAddTranslation={handleAddTranslation}
                onRemoveTranslation={handleRemoveTranslation}
                onCloseDialog={handleCloseDialog}
                error={error}
                isDialogVisible={isDialogVisible}
            />

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2" htmlFor="type">
                        {t('type')}
                    </label>
                    <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => handleSelectChange(e, 'type')}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    >
                        {Object.keys(MeasureValueType)
                            .filter((v) => isNaN(Number(v)))
                            .map((key) => (
                                <option key={key} value={key}>
                                    {t(`measureValueType.${key}`)}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Gebruik de generieke ToggleSwitch component */}
                <ToggleSwitch
                    isEnabled={formData.isEditable}
                    onToggle={handleToggleChange}
                    label={t('isEditable')}
                />
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="defaultValue">
                        {t('defaultValue')}
                    </label>
                    <input
                        type="text"
                        id="defaultValue"
                        value={formData.defaultValue}
                        onChange={(e) => handleChange(e, 'defaultValue')}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
                    {t('save')}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
                >
                    {t('cancel')}
                </button>
            </div>
        </form>
    );
}
