"use client"
import React, {useEffect, useState} from 'react';
import AdminLayout from "@/app/admin/adminlayout";
import {useTranslations} from "next-intl";
import ConfirmationDialog from "@/components/admin/confirmation-dialog";
import {MeasureValue} from "@/app/admin/measure-value/measureValue";
import {deleteMeasureValue, getMeasureValues, saveMeasureValue} from "@/app/admin/measure-value/client";
import MeasureValueForm from "@/components/admin/measure_value/measure-value-form";
import {languageSuggestions} from "@/components/admin/measure_value/language-suggestions";

export default function MeasureValuesPage() {
    const t = useTranslations('admin.measureValue');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [measureValues, setMeasureValues] = useState<MeasureValue[]>([]);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [editingMeasureValue, setEditingMeasureValue] = useState<MeasureValue | null>(null);
    const [measureValueToDelete, setMeasureValueToDelete] = useState<MeasureValue | null>(null);

    useEffect(() => {
        getMeasureValues().then(values => {
            setMeasureValues(values);
        });
    }, []);

    const handleSave = async (measureValue: MeasureValue, isNew: boolean) => {
        saveMeasureValue(measureValue, isNew).then(valueToAdd => {
            setMeasureValues((prev) => {
                const existing = prev.find(mv => mv.name === valueToAdd.name);
                return existing ? prev.map(mv => (mv.name === valueToAdd.name ? valueToAdd : mv)) : [...prev, valueToAdd];
            });
            setEditingMeasureValue(null);
        });
    };

    const openDialog = (measureValue: MeasureValue) => {
        setMeasureValueToDelete(measureValue);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setMeasureValueToDelete(null);
        setIsDialogOpen(false);
    };

    const handleDelete = async () => {
        if (measureValueToDelete) {
            const isSuccess = await deleteMeasureValue(measureValueToDelete);
            if (isSuccess) {
                setMeasureValues(prev => prev.filter(mv => mv.name !== measureValueToDelete.name));
                closeDialog();
            } else {
                console.error('Failed to delete measure value');
            }
        }
    };

    const openEditor = (measureValue: MeasureValue, isNew: boolean) => {
        setEditingMeasureValue(measureValue);
        setIsNew(isNew);
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t('manageMeasureValues')}</h1>
                {editingMeasureValue ? (
                    <MeasureValueForm
                        measureValue={editingMeasureValue}
                        isNew={isNew}
                        onSave={handleSave}
                        onCancel={() => setEditingMeasureValue(null)}
                    />
                ) : (
                    <>
                        <button
                            onClick={() => openEditor(new MeasureValue('', [], '', '', true, ''), true)}
                            className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600"
                        >
                            {t('newMeasureValue')}
                        </button>
                        <table className="table-auto w-full border-collapse bg-cyan-900 text-white rounded shadow-lg">
                            <thead>
                            <tr className="border-b border-cyan-700">
                                <th className="py-2 px-4 text-left">{t('name')}</th>
                                <th className="py-2 px-4 text-left">{t('unit')}</th>
                                <th className="py-2 px-4 text-left">{t('translations')}</th>
                                <th className="py-2 px-4 text-left">{t('type')}</th>
                                <th className="py-2 px-4 text-left">{t('defaultValue')}</th>
                                <th className="py-2 px-4 text-left">{t('actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {measureValues.map((measureValue) => (
                                <tr key={measureValue.name} className="border-b border-cyan-700">
                                    <td className="py-2 px-4">{measureValue.name}</td>
                                    <td className="py-2 px-4">{measureValue.unit ? measureValue.unit : t(`undefined`)}</td>
                                    <td className="py-2 px-4">
                                        {measureValue.translations
                                            .map(value => (
                                                <p key={value.locale}>
                                                    {languageSuggestions
                                                        .filter(value1 => value1.value == value.locale)
                                                        .map(value => value.label)}: {value.value}
                                                </p>
                                            ))}
                                    </td>
                                    <td className="py-2 px-4">{t(`measureValueType.${measureValue.type}`)}</td>
                                    <td className="py-2 px-4">{measureValue.defaultValue}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => openEditor(measureValue, false)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            {t('edit')}
                                        </button>
                                        <button
                                            onClick={() => openDialog(measureValue)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            {t('delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
                <ConfirmationDialog
                    isOpen={isDialogOpen}
                    onClose={closeDialog}
                    onConfirm={handleDelete}
                    title={t('deleteConfirmationTitle')}
                    message={t('deleteConfirmationMessage')}
                    confirmText={t('confirmDeleteButton')}
                    cancelText={t('cancelButton')}
                />
            </div>
        </AdminLayout>
    );
}
