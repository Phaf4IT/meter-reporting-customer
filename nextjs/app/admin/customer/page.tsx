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
import EditableCustomerRow from "@/components/admin/customer/editable-customer-row";
import {FaArrowDown, FaArrowUp} from 'react-icons/fa';

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

    // New state for sorting
    const [sortColumn, setSortColumn] = useState<string>(''); // Default sort by last name
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

    const handleSort = (column: string) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);

        setCustomers((prevCustomers) => {
            return [...prevCustomers].sort((a, b) => {
                const getValue = (obj: any, path: string) => {
                    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
                };

                const valueA = getValue(a, column) ?? '';
                const valueB = getValue(b, column) ?? '';

                if (valueA < valueB) return direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        });
    };


    const handleSave = async (customer: ModifiableCustomer & C, isNew: boolean) => {
        saveCustomer(customer, isNew)
            .then(customerToAdd => {
                const customerWithEntity = {...customerToAdd, entity: customer.entity, isNonActive: false};
                setCustomers((prev) => {
                        const c = prev.find(c => c.id === customerWithEntity.id)
                        return c ? prev.map((c) => (c.id === customerWithEntity.id ? customerWithEntity : c)) : [...prev, customerWithEntity];
                    }
                );
                closeEditor();
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
                setCustomers((prev) => prev.map((c) => {
                    if (c.id === customerToDelete.id) {
                        c.isNonActive = true;
                    }
                    return c;
                }));
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

    const closeEditor = () => {
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
                        <th
                            className="py-2 px-4 text-left cursor-pointer select-none"
                            onClick={() => handleSort('title')}
                        >
                            {t('title')}
                            {sortColumn === 'title' && (
                                sortDirection === 'asc' ? <FaArrowUp className="inline ml-2"/> :
                                    <FaArrowDown className="inline ml-2"/>
                            )}
                        </th>
                        <th
                            className="py-2 px-4 text-left cursor-pointer select-none"
                            onClick={() => handleSort('email')}
                        >
                            {t('email')}
                            {sortColumn === 'email' && (
                                sortDirection === 'asc' ? <FaArrowUp className="inline ml-2"/> :
                                    <FaArrowDown className="inline ml-2"/>
                            )}
                        </th>
                        <th
                            className="py-2 px-4 text-left cursor-pointer select-none"
                            onClick={() => handleSort('lastName')}
                        >
                            {t('name')}
                            {sortColumn === 'lastName' && (
                                sortDirection === 'asc' ? <FaArrowUp className="inline ml-2"/> :
                                    <FaArrowDown className="inline ml-2"/>
                            )}
                        </th>
                        <th
                            className="py-2 px-4 text-left cursor-pointer select-none"
                            onClick={() => handleSort('entity')}
                        >
                            {t('entity')}
                            {sortColumn === 'entity' && (
                                sortDirection === 'asc' ? <FaArrowUp className="inline ml-2"/> :
                                    <FaArrowDown className="inline ml-2"/>
                            )}
                        </th>
                        <th
                            className="py-2 px-4 text-left cursor-pointer select-none"
                            onClick={() => handleSort('phoneNumber')}
                        >
                            {t('phoneNumber')}
                            {sortColumn === 'phoneNumber' && (
                                sortDirection === 'asc' ? <FaArrowUp className="inline ml-2"/> :
                                    <FaArrowDown className="inline ml-2"/>
                            )}
                        </th>
                        {fieldKeys.map((fieldKey) => {
                            const translationForLocale = getTranslationForLocaleFields(locale);
                            const fieldLabel = translationForLocale ? translationForLocale[fieldKey] : fieldKey;
                            return (
                                <th
                                    key={fieldKey}
                                    className="px-4 py-2 text-left cursor-pointer select-none"
                                    onClick={() => handleSort(`additionalFields.${fieldKey}`)}
                                >
                                    {fieldLabel}
                                    {sortColumn === `additionalFields.${fieldKey}` && (
                                        sortDirection === 'asc' ? <FaArrowUp className="inline ml-2"/> :
                                            <FaArrowDown className="inline ml-2"/>
                                    )}
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
                                <EditableCustomerRow key={customer.id} customer={editingCustomer} isNew={isNew}
                                                     onSave={handleSave} onCancel={closeEditor} entities={entities}/>
                            ) : (
                                <>
                                    <td className="py-2 px-4">
                                        {customer.title ? t(customer.title) : ''}
                                    </td>

                                    <td className="py-2 px-4">{customer.email}</td>
                                    <td className="py-2 px-4">
                                        {customer.firstName}{' '}
                                        {customer.middleName ? `${customer.middleName} ` : ''}
                                        {customer.lastName}
                                    </td>
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
                                    </td>
                                    <td className="py-2 px-4">{customer.phoneNumber}</td>

                                    <>
                                        {Object.entries(additionalFieldCustomers.fields).map(([fieldKey]) => {
                                            return (
                                                <td key={`${customer.id}-${fieldKey}`} className="px-4 py-2">
                                                    {customer.additionalFields ? customer.additionalFields[fieldKey] : 'N/A'}
                                                </td>
                                            );
                                        })}
                                    </>
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
                                    </td>
                                </>
                            )}

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
