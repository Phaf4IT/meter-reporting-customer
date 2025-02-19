"use client"
import React, {useEffect, useState} from 'react';
import AdminLayout from "@/app/admin/adminlayout";
import {useLocale, useTranslations} from "next-intl";
import {additionalFields, Customer as C, emptyCustomer} from "@/components/admin/customer/customer";
import ConfirmationDialog from "@/components/admin/confirmation-dialog"; // Import confirmation dialog
import "@/components/dialog-styles.css";
import {deleteCustomer, getCustomers, getNonActiveCustomers, saveCustomer} from "@/app/admin/customer/client";
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";
import {getTranslationForLocale} from "@/components/admin/entity-type/entityType";
import {Entity} from "@/components/admin/entity/entity";
import {getAllEntities} from "@/app/admin/entity/client";

export interface Customer extends C {
    id: string;
    email: string;
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    entity?: Entity;
    phoneNumber?: string;
    additionalFields?: any;
    isNonActive: boolean
}

export default function CustomersPage() {
    const t = useTranslations('admin.customer');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<Customer & ModifiableCustomer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const locale = useLocale();
    const additionalFieldCustomers = additionalFields();
    const fieldKeys = Object.keys(additionalFieldCustomers.fields || []);

    useEffect(() => {
        Promise.all([getCustomers(), getNonActiveCustomers()])
            .then(value => setCustomers([
                ...value[0].map(value1 => ({...value1, isNonActive: false})),
                ...value[1].map(value1 => ({...value1, isNonActive: true}))
            ]));
    }, []);

    useEffect(() => {
        getAllEntities()
            .then(entities => setEntities(entities));
    }, []);

    const handleSave = async (customer: ModifiableCustomer & C, isNew: boolean) => {
        saveCustomer(customer, isNew)
            .then(customerToAdd => {
                const customerWithEntity = {...customerToAdd, entity: customer.entity, isNonActive: false};
                setCustomers((prev) => {
                        const c = prev.find(c => c.id === customerWithEntity.id)
                        return c ? prev.map((c) => (c.id === customerWithEntity.id ? customerWithEntity : c)) : [...prev, customerWithEntity];
                    }
                );
                closeEditor(customer, isNew);
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
        if (isNew) {
            setCustomers(prevState => [...prevState, customer]);
        }
        setEditingCustomer(customer);
        setIsNew(isNew);
    }

    const closeEditor = (customer: ModifiableCustomer & C, isNew: boolean) => {
        if (isNew) {
            setCustomers(prevState => [...prevState.filter((c) => c.id)]);
        }
        setEditingCustomer(null);
    }

    function getTranslationForLocaleFields(locale: string) {
        const languageCode = locale.split('-')[0];
        const translationKey = additionalFieldCustomers ? Object.keys(additionalFieldCustomers?.translations).find(key => key.startsWith(languageCode)) : undefined;
        return translationKey ? additionalFieldCustomers?.translations[translationKey] : additionalFieldCustomers?.translations['en-US'];  // Fallback naar Engels als geen vertaling gevonden
    }

    const handleInputChangeAdditionalField = (field: string, value: any) => {
        setEditingCustomer(prev => {
            const newAdditionalFields = prev ? prev.additionalFields || {} : {};
            newAdditionalFields[field] = value;
            return prev ? {...prev, additionalFields: newAdditionalFields} : prev;
        })
    };

    const handleInputChangeEntityField = (entityId: string) => {
        setEditingCustomer(prev => {
            return prev ? {...prev, entityId: entityId, entity: entities.find(e => e.id === entityId)} : prev;
        })
    }

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t('manageCustomers')}</h1>
                <button
                    onClick={() =>
                        openEditor({...emptyCustomer(), isNonActive: false}, true)
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
                        <tr
                            key={customer.id}
                            className={`border-b border-cyan-700 ${customer.isNonActive ? 'bg-gray-500' : 'bg-cyan-900'}`}
                        >
                            {editingCustomer && editingCustomer.id === customer.id ? (
                                <td className="py-2 px-4">
                                    <select
                                        id="title"
                                        value={editingCustomer.title}
                                        onChange={(e) => setEditingCustomer({
                                            ...editingCustomer,
                                            title: e.target.value
                                        })}
                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="">{t("none")}</option>
                                        <option value="mr">{t("mr")}</option>
                                        <option value="mrs">{t("mrs")}</option>
                                        <option value="family">{t("family")}</option>
                                    </select>
                                </td>
                            ) : (
                                <td className="py-2 px-4">
                                    {customer.title ? t(customer.title) : ''}
                                </td>
                            )}
                            {editingCustomer && editingCustomer.id === customer.id ? (
                                <td className="py-2 px-4">
                                    <input
                                        type="email"
                                        id="email"
                                        value={editingCustomer.email}
                                        onChange={(e) => setEditingCustomer({
                                            ...editingCustomer,
                                            email: e.target.value
                                        })}
                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                        required
                                    />
                                </td>
                            ) : (
                                <td className="py-2 px-4">{customer.email}</td>
                            )}
                            {editingCustomer && editingCustomer.id === customer.id ? (
                                <td className="py-2 px-4">
                                    <label
                                        className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                                        htmlFor="firstName">
                                        {t('firstName')}
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={editingCustomer.firstName}
                                        onChange={(e) => setEditingCustomer({
                                            ...editingCustomer,
                                            firstName: e.target.value
                                        })}
                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                        required
                                    />
                                    <label
                                        className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                                        htmlFor="middleName">
                                        {t('middleName')}
                                    </label>
                                    <input
                                        type="text"
                                        id="middleName"
                                        value={editingCustomer.middleName || ''}
                                        onChange={(e) => setEditingCustomer({
                                            ...editingCustomer,
                                            middleName: e.target.value
                                        })}
                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                    />
                                    <label
                                        className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                                        htmlFor="lastName">
                                        {t('lastName')}
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={editingCustomer.lastName}
                                        onChange={(e) => setEditingCustomer({
                                            ...editingCustomer,
                                            lastName: e.target.value
                                        })}
                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                        required
                                    />
                                </td>
                            ) : (
                                <td className="py-2 px-4">
                                    {customer.firstName}{' '}
                                    {customer.middleName ? `${customer.middleName} ` : ''}
                                    {customer.lastName}
                                </td>)}

                            {editingCustomer && editingCustomer.id === customer.id ? (
                                <td className="py-2 px-4">
                                    <select
                                        onChange={(e) => handleInputChangeEntityField(e.target.value)}
                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                    >
                                        <option>{t('selectEntity')}</option>
                                        {entities.map((entity: any) => {
                                            return (
                                                <option key={`${customer.id}-${entity.id}`} value={entity.id}>
                                                    {Object.keys(entity.entityType?.fields || []).map((fieldKey) => {
                                                        const fieldLabel = getTranslationForLocale(entity.entityType!, locale)[fieldKey] || fieldKey;
                                                        const fieldValue = getTranslationForLocale(entity.entityType!, locale)[entity.fieldValues[fieldKey] || 'N/A'] || entity.fieldValues[fieldKey] || 'N/A';
                                                        return (
                                                            <React.Fragment key={fieldValue}>
                                                                {fieldLabel}: {fieldValue}&nbsp;
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </td>
                            ) : (
                                <td className="py-2 px-4">
                                    {Object.keys(customer.entity?.entityType?.fields || []).map((fieldKey) => {
                                        const fieldLabel = getTranslationForLocale(customer.entity!.entityType!, locale)[fieldKey] || fieldKey;
                                        const fieldValue = getTranslationForLocale(customer.entity!.entityType!, locale)[customer.entity!.fieldValues[fieldKey] || 'N/A'] || customer.entity!.fieldValues[fieldKey] || 'N/A';
                                        return (
                                            <p key={fieldKey}>
                                                {fieldLabel}: {fieldValue}
                                            </p>
                                        )
                                    })}
                                </td>)}

                            {editingCustomer && editingCustomer.id === customer.id ? (
                                <td className="py-2 px-4">
                                    <input
                                        type="text"
                                        id="phone-number"
                                        value={editingCustomer.phoneNumber}
                                        onChange={(e) => setEditingCustomer({
                                            ...editingCustomer,
                                            phoneNumber: e.target.value
                                        })}
                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                    />
                                </td>
                            ) : (
                                <td className="py-2 px-4">{customer.phoneNumber}</td>
                            )}


                            {Object.entries(additionalFieldCustomers.fields).map(([fieldKey, field]) => {
                                const fieldType = field.type;
                                const isRequired = field.required;

                                if (editingCustomer && editingCustomer.id === customer.id) {
                                    switch (fieldType) {
                                        case 'text':
                                            return (
                                                <td key={`${customer.id}-${fieldKey}`} className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        required={isRequired}
                                                        value={editingCustomer.additionalFields && editingCustomer.additionalFields[fieldKey] ? editingCustomer.additionalFields[fieldKey] : ''}
                                                        onChange={(e) => handleInputChangeAdditionalField(fieldKey, e.target.value)}
                                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                                    />
                                                </td>
                                            );

                                        case 'text[]':
                                            return (
                                                <td key={`${customer.id}-${fieldKey}`} className="px-4 py-2">
                                                        <textarea
                                                            value={(editingCustomer.additionalFields && editingCustomer.additionalFields[fieldKey] ? editingCustomer.additionalFields[fieldKey] : []).join('\n')}
                                                            required={isRequired}
                                                            onChange={(e) => handleInputChangeAdditionalField(fieldKey, e.target.value.split('\n'))}
                                                            className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                                        />
                                                </td>
                                            );

                                        case 'numeric':
                                            return (
                                                <td key={`${customer.id}-${fieldKey}`} className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        required={isRequired}
                                                        value={editingCustomer.additionalFields && editingCustomer.additionalFields[fieldKey] ? editingCustomer.additionalFields[fieldKey] : ''}
                                                        onChange={(e) => handleInputChangeAdditionalField(fieldKey, parseFloat(e.target.value))}
                                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                                    />
                                                </td>
                                            );

                                        case 'boolean':
                                            return (
                                                <td key={`${customer.id}-${fieldKey}`} className="px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        required={isRequired}
                                                        checked={editingCustomer.additionalFields && editingCustomer.additionalFields[fieldKey] ? editingCustomer.additionalFields[fieldKey] : false}
                                                        onChange={(e) => handleInputChangeAdditionalField(fieldKey, e.target.checked)}
                                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                                    />
                                                </td>
                                            );

                                        case 'date':
                                            return (
                                                <td key={`${customer.id}-${fieldKey}`} className="px-4 py-2">
                                                    <input
                                                        type="date"
                                                        required={isRequired}
                                                        value={editingCustomer.additionalFields && editingCustomer.additionalFields[fieldKey] ? editingCustomer.additionalFields[fieldKey] : ''}
                                                        onChange={(e) => handleInputChangeAdditionalField(fieldKey, e.target.value)}
                                                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                                    />
                                                </td>
                                            );

                                        default:
                                            return null;
                                    }
                                } else {
                                    return (
                                        <td key={`${customer.id}-${fieldKey}`} className="px-4 py-2">
                                            {customer.additionalFields ? customer.additionalFields[fieldKey] : 'N/A'}
                                        </td>
                                    );
                                }

                            })}
                            <td className="py-2 px-4 space-x-2">
                                {
                                    customer.isNonActive && (<>Inactief</>)}
                                {
                                    !customer.isNonActive && editingCustomer?.id !== customer.id && (
                                        <>
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
                                        </>
                                    )
                                }
                                {
                                    !customer.isNonActive && editingCustomer?.id === customer.id && (
                                        <>
                                            <button
                                                onClick={() => handleSave(editingCustomer, isNew)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                            >
                                                {t('save')}
                                            </button>
                                            <button
                                                onClick={() => closeEditor(editingCustomer, isNew)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                {t('cancel')}
                                            </button>
                                        </>
                                    )
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
