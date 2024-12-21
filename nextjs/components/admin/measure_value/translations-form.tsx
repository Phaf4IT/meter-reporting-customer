import React, {useRef, useState} from 'react';
import {FaPlusCircle, FaTrashAlt} from 'react-icons/fa';
import {MeasureValueTranslation} from '@/app/admin/measure-value/measureValue';
import InputWithSuggestions from '@/components/admin/input-with-suggestions';
import Dialog from 'rc-dialog';
import {languageSuggestions} from './language-suggestions';

interface TranslationsFormProps {
    translations: MeasureValueTranslation[];
    onAddTranslation: (locale: string, value: string) => void;
    onRemoveTranslation: (locale: string) => void;
    onCloseDialog: () => void;
    error: string | null;
    isDialogVisible: boolean;
}

const TranslationsForm: React.FC<TranslationsFormProps> = ({
                                                               translations,
                                                               onAddTranslation,
                                                               onRemoveTranslation,
                                                               onCloseDialog,
                                                               error,
                                                               isDialogVisible,
                                                           }) => {
    const [newTranslation, setNewTranslation] = useState<{ locale: string; value: string }>({locale: '', value: ''});
    const localeInputRef = useRef<HTMLInputElement>(null);

    const handleTranslationChange = (field: keyof typeof newTranslation, newValue: string) => {
        setNewTranslation({
            ...newTranslation,
            [field]: newValue,
        });
    };

    const handleAddTranslation = () => {
        if (newTranslation.locale && newTranslation.value) {
            onAddTranslation(newTranslation.locale, newTranslation.value);
            setNewTranslation({locale: '', value: ''});

            if (localeInputRef.current) {
                localeInputRef.current.focus();
            }
        }
    };

    return (
        <div>
            <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2">
                Vertalingen
            </label>
            <div className="space-y-2">
                {translations.map((translation) => (
                    <div key={translation.locale} className="grid grid-cols-3 gap-6">
                        <span className="text-xl">{translation.locale}</span> <span
                        className="text-xl">{translation.value}</span>
                        <button
                            type="button"
                            onClick={() => onRemoveTranslation(translation.locale)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FaTrashAlt/>
                        </button>
                    </div>
                ))}

                <div className="grid grid-cols-3 gap-6">
                    <div className="w-full relative">
                        <InputWithSuggestions
                            value={newTranslation.locale}
                            onChange={(newValue) => handleTranslationChange('locale', newValue)}
                            suggestions={languageSuggestions}
                            onSelect={(locale) => setNewTranslation({...newTranslation, locale})}
                            ref={localeInputRef}
                        />
                        <label className="block tracking-wide text-gray-200 text-xs font-bold mb-2" htmlFor="locale">
                            Locale
                        </label>
                    </div>

                    <div className="w-full">
                        <input
                            type="text"
                            value={newTranslation.value}
                            onChange={(e) => handleTranslationChange('value', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTranslation();
                                }
                            }}
                            className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4"
                        />
                        <label className="block tracking-wide text-gray-200 text-xs font-bold mb-2"
                               htmlFor="translationValue">
                            Vertaalwaarde
                        </label>
                    </div>

                    <div className="w-full">
                        <button
                            type="button"
                            onClick={handleAddTranslation}
                            className="text-cyan-500 hover:text-cyan-700"
                        >
                            <FaPlusCircle/>
                        </button>
                    </div>
                </div>

                <Dialog
                    visible={isDialogVisible}
                    onClose={onCloseDialog}
                    title="Waarschuwing"
                    className="bg-cyan-900 text-white p-6 rounded shadow-md max-w-lg mx-auto"
                    footer={
                        <div className="text-right">
                            <button
                                onClick={onCloseDialog}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Sluiten
                            </button>
                        </div>
                    }
                >
                    <div>{error}</div>
                </Dialog>
            </div>
        </div>
    );
};

export default TranslationsForm;
