"use client"
import React, {useEffect, useState} from 'react';
import AdminLayout from "@/app/admin/adminlayout";
import {useLocale, useTranslations} from "next-intl";
import {additionalFields, Customer, emptyCustomer} from "@/components/admin/customer/customer";
import CustomerForm from "@/components/admin/customer/customer-form";
import ConfirmationDialog from "@/components/admin/confirmation-dialog"; // Import confirmation dialog
import "@/components/dialog-styles.css";
import {deleteCustomer, getCustomers, saveCustomer} from "@/app/admin/customer/client";
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";
import {getTranslationForLocale} from "@/components/admin/entity-type/entityType";

export default function CustomersPage() {
    const t = useTranslations('admin.customer');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const locale = useLocale();
    const additionalFieldCustomers = additionalFields();
    const fieldKeys = Object.keys(additionalFieldCustomers.fields || []);

    useEffect(() => {
        getCustomers()
            .then(customers => {
                setCustomers(customers);
            })
    }, []);

    const handleSave = async (customer: ModifiableCustomer & Customer, isNew: boolean) => {
        saveCustomer(customer, isNew)
            .then(customerToAdd => {
                const customerWithEntity = {...customerToAdd, entity: customer.entity};
                setCustomers((prev) => {
                        const c = prev.find(c => c.id === customerWithEntity.id)
                        return c ? prev.map((c) => (c.id === customerWithEntity.id ? customerWithEntity : c)) : [...prev, customerWithEntity];
                    }
                );
                setEditingCustomer(null);
            });
    };

    const openDialog = (customer: Customer) => {
        setCustomerToDelete(customer);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setCustomerToDelete(null);
        setIsDialogOpen(false);
    };

    const handleDelete = async () => {
        if (customerToDelete) {
            const isSuccess = await deleteCustomer({...customerToDelete, entityId: customerToDelete.entity?.id});
            if (isSuccess) {
                setCustomers((prev) => prev.filter((c) => c.email !== customerToDelete.email));
                closeDialog();
            } else {
                console.error('Failed to delete customer');
            }
        }
    };

    const openEditor = (customer: Customer, isNew: boolean) => {
        setEditingCustomer(customer);
        setIsNew(isNew);
    }

    function getTranslationForLocaleFields(locale: string) {
        const languageCode = locale.split('-')[0];
        const translationKey = additionalFieldCustomers ? Object.keys(additionalFieldCustomers?.translations).find(key => key.startsWith(languageCode)) : undefined;
        return translationKey ? additionalFieldCustomers?.translations[translationKey] : additionalFieldCustomers?.translations['en-US'];  // Fallback naar Engels als geen vertaling gevonden
    }

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t('manageCustomers')}</h1>
                {editingCustomer ? (
                    <CustomerForm
                        customer={editingCustomer}
                        entity={editingCustomer.entity!}
                        isNew={isNew}
                        onSave={handleSave}
                        onCancel={() => setEditingCustomer(null)}
                    />
                ) : (
                    <>
                        <button
                            onClick={() =>
                                openEditor(emptyCustomer(), true)
                            }
                            className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600"
                        >
                            {t('newCustomer')}
                        </button>
                        <table className="table-auto w-full border-collapse bg-cyan-900 text-white rounded shadow-lg">
                            <thead>
                            <tr className="border-b border-cyan-700">
                                <th className="py-2 px-4 text-left">{t('title')}</th>
                                <th className="py-2 px-4 text-left">{t('email')}</th>
                                <th className="py-2 px-4 text-left">{t('name')}</th>
                                <th className="py-2 px-4 text-left">{t('entity')}</th>
                                <th className="py-2 px-4 text-left">{t('phoneNumber')}</th>
                                {fieldKeys.map((fieldKey) => {
                                    const translationForLocale = getTranslationForLocaleFields(locale);
                                    const fieldLabel = translationForLocale ? translationForLocale[fieldKey] : fieldKey;
                                    return (
                                        <th key={fieldKey} className="px-4 py-2 text-left">
                                            {fieldLabel}
                                        </th>
                                    );
                                })}
                                <th className="py-2 px-4 text-left">{t('actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="border-b border-cyan-700">
                                    <td className="py-2 px-4">{customer.title ? t(customer.title) : ''}</td>
                                    <td className="py-2 px-4">{customer.email}</td>
                                    <td className="py-2 px-4">
                                        {customer.firstName}{' '}
                                        {customer.middleName ? `${customer.middleName} ` : ''}
                                        {customer.lastName}
                                    </td>
                                    <td className="py-2 px-4">
                                        {Object.keys(customer.entity?.entityType?.fields || []).map((fieldKey) => {
                                            const fieldLabel = getTranslationForLocale(customer.entity!.entityType!, locale)[fieldKey] || fieldKey;
                                            return (
                                                <p key={fieldKey}>
                                                    {fieldLabel}: {customer.entity!.fieldValues[fieldKey] || 'N/A'}
                                                </p>
                                            )
                                        })}
                                    </td>
                                    <td className="py-2 px-4">{customer.phoneNumber}</td>
                                    {fieldKeys.map((fieldKey) => (
                                        <td key={`${customer.id}-${fieldKey}`} className="px-4 py-2">
                                            {customer.additionalFields ? customer.additionalFields[fieldKey] : 'N/A'}
                                        </td>
                                    ))}
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => openEditor(customer, false)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            {t('edit')}
                                        </button>
                                        <button
                                            onClick={() => openDialog(customer)}
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
                    title={t("deleteConfirmationTitle")}
                    message={t("deleteConfirmationMessage")}
                    confirmText={t("confirmDeleteButton")}
                    cancelText={t("cancelButton")}
                />
            </div>
        </AdminLayout>
    );
}
