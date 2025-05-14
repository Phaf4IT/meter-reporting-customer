'use client';
import React, {useEffect, useRef, useState} from 'react';
import {useLocale, useTranslations} from "next-intl";
import {additionalFields, Customer as C, emptyCustomer} from "@/components/admin/customer/customer";
import ConfirmationDialog from "@/components/admin/confirmation-dialog";
import "@/components/dialog-styles.css";
import {deleteCustomer, getCustomers, getNonActiveCustomers, saveCustomer} from "@/app/admin/customer/client";
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";
import {getTranslationForLocale} from "@/components/admin/entity-type/entityType";
import {Entity} from "@/components/admin/entity/entity";
import {getAllEntities} from "@/app/admin/entity/client";
import EditableCustomerRow from "@/components/admin/customer/editable-customer-row";
import {FaArrowDown, FaArrowUp} from 'react-icons/fa';
import {FiMoreHorizontal} from 'react-icons/fi';

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const locale = useLocale();
    const additionalFieldCustomers = additionalFields();
    const fieldKeys = Object.keys(additionalFieldCustomers.fields || []);
    const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);
    const columnsMenuRef = useRef<HTMLDivElement>(null);
    const defaultVisibleColumns: Record<string, boolean> = {
        email: true,
        lastName: true,
        entity: true,
        phoneNumber: true,
        ...fieldKeys.reduce((acc, key) => ({...acc, [`additionalFields.${key}`]: true}), {})
    };

    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('visibleCustomerColumns');
            return saved ? JSON.parse(saved) : defaultVisibleColumns;
        }
        return defaultVisibleColumns;
    });

    useEffect(() => {
        localStorage.setItem('visibleCustomerColumns', JSON.stringify(visibleColumns));
    }, [visibleColumns]);

    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        Promise.all([getCustomers(), getNonActiveCustomers()])
            .then(([active, inactive]) => {
                setCustomers([
                    ...active.map(c => ({...c, isNonActive: false})),
                    ...inactive.map(c => ({...c, isNonActive: true}))
                ]);
            });
    }, []);

    useEffect(() => {
        getAllEntities().then(setEntities);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutsideColumns = (event: MouseEvent) => {
            if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
                setIsColumnsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideColumns);
        return () => document.removeEventListener('mousedown', handleClickOutsideColumns);
    }, []);

    const handleSort = (column: string) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
        setCustomers((prev) => {
            return [...prev].sort((a, b) => {
                const getValue = (obj: any, path: string) =>
                    path.split('.').reduce((acc, part) => acc && acc[part], obj);
                const valueA = getValue(a, column) ?? '';
                const valueB = getValue(b, column) ?? '';
                if (valueA < valueB) return direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        });
    };

    const handleSave = async (customer: ModifiableCustomer & C, isNew: boolean) => {
        saveCustomer(customer, isNew).then(saved => {
            const newCustomer = {...saved, entity: customer.entity, isNonActive: false};
            setCustomers(prev => {
                const exists = prev.find(c => c.id === newCustomer.id);
                return exists
                    ? prev.map(c => c.id === newCustomer.id ? newCustomer : c)
                    : [...prev, newCustomer];
            });
            closeEditor();
        });
    };

    const openDialog = (customer: Customer) => {
        setCustomerToDelete(customer);
        setIsDialogOpen(true);
        setIsMenuOpen(false);
    };

    const closeDialog = () => {
        setCustomerToDelete(null);
        setIsDialogOpen(false);
    };

    const handleDelete = async () => {
        if (customerToDelete) {
            const success = await deleteCustomer({...customerToDelete, entityId: customerToDelete.entity?.id});
            if (success) {
                setCustomers(prev =>
                    prev.map(c =>
                        c.id === customerToDelete.id ? {...c, isNonActive: true} : c
                    )
                );
                closeDialog();
            } else {
                console.error('Failed to delete customer');
            }
        }
    };

    const openEditor = (customer: Customer, isNew: boolean) => {
        if (isNew) setCustomers(prev => [...prev, customer]);
        setEditingCustomer(customer);
        setIsNew(isNew);
        setIsMenuOpen(false);
    };

    const closeEditor = () => {
        if (isNew) setCustomers(prev => prev.filter(c => c.id));
        setEditingCustomer(null);
    };

    const getTranslationForLocaleFields = (locale: string) => {
        const lang = locale.split('-')[0];
        const key = Object.keys(additionalFieldCustomers?.translations || {}).find(k => k.startsWith(lang));
        return key ? additionalFieldCustomers.translations[key] : additionalFieldCustomers.translations['en-US'];
    };

    return (
        <div className="min-h-screen p-8 bg-cyan-950 text-white">
            <h1 className="text-2xl font-bold mb-6">{t('manageCustomers')}</h1>
            <button
                onClick={() => openEditor({...emptyCustomer(), isNonActive: false}, true)}
                className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600"
            >
                {t('newCustomer')}
            </button>

            {/* Kolomkiezer */}
            <div className="relative inline-block text-left mb-4">
                <button
                    onClick={() => setIsColumnsMenuOpen(prev => !prev)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    {t('chooseColumns')}
                </button>
                {isColumnsMenuOpen && (
                    <div ref={columnsMenuRef}
                         className="absolute z-10 mt-2 w-64 bg-white text-black rounded shadow-lg p-4 space-y-2">
                        {Object.entries(visibleColumns).map(([key, isVisible]) => (
                            <label key={key} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isVisible}
                                    onChange={() => setVisibleColumns(prev => ({
                                        ...prev,
                                        [key]: !prev[key],
                                    }))}
                                />
                                <span>
                                    {(() => {
                                        if (key === 'email') return t('email');
                                        if (key === 'lastName') return t('name');
                                        if (key === 'entity') return t('entity');
                                        if (key === 'phoneNumber') return t('phoneNumber');
                                        const extraKey = key.replace('additionalFields.', '');
                                        const translationForLocale = getTranslationForLocaleFields(locale);
                                        return translationForLocale?.[extraKey] || extraKey;
                                    })()}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
                <table className="table-auto min-w-full border-collapse bg-cyan-900 text-white rounded shadow-lg">
                    <thead>
                    <tr className="border-b border-cyan-700">
                        {visibleColumns['email'] && (
                            <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('email')}>
                                {t('email')}{sortColumn === 'email' && (sortDirection === 'asc' ?
                                <FaArrowUp className="inline ml-2"/> : <FaArrowDown className="inline ml-2"/>)}
                            </th>
                        )}
                        {visibleColumns['lastName'] && (
                            <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('lastName')}>
                                {t('name')}{sortColumn === 'lastName' && (sortDirection === 'asc' ?
                                <FaArrowUp className="inline ml-2"/> : <FaArrowDown className="inline ml-2"/>)}
                            </th>
                        )}
                        {visibleColumns['entity'] && (
                            <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('entity')}>
                                {t('entity')}{sortColumn === 'entity' && (sortDirection === 'asc' ?
                                <FaArrowUp className="inline ml-2"/> : <FaArrowDown className="inline ml-2"/>)}
                            </th>
                        )}
                        {visibleColumns['phoneNumber'] && (
                            <th className="py-2 px-4 text-left cursor-pointer"
                                onClick={() => handleSort('phoneNumber')}>
                                {t('phoneNumber')}{sortColumn === 'phoneNumber' && (sortDirection === 'asc' ?
                                <FaArrowUp className="inline ml-2"/> : <FaArrowDown className="inline ml-2"/>)}
                            </th>
                        )}
                        {fieldKeys.map((fieldKey) => {
                            const fullKey = `additionalFields.${fieldKey}`;
                            if (!visibleColumns[fullKey]) return null;
                            const label = getTranslationForLocaleFields(locale)?.[fieldKey] || fieldKey;
                            return (
                                <th key={fieldKey} className="px-4 py-2 text-left cursor-pointer"
                                    onClick={() => handleSort(fullKey)}>
                                    {label}
                                    {sortColumn === fullKey && (sortDirection === 'asc' ?
                                        <FaArrowUp className="inline ml-2"/> : <FaArrowDown className="inline ml-2"/>)}
                                </th>
                            );
                        })}
                        <th className="py-2 px-4 text-left">{t('actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}
                            className={`border-b border-cyan-700 ${customer.isNonActive ? 'bg-gray-500' : 'bg-cyan-900'}`}>
                            {editingCustomer?.id === customer.id ? (
                                <EditableCustomerRow key={customer.id} customer={editingCustomer} isNew={isNew}
                                                     onSave={handleSave} onCancel={closeEditor} entities={entities}/>
                            ) : (
                                <>
                                    {visibleColumns['email'] && <td className="py-2 px-4">{customer.email}</td>}
                                    {visibleColumns['lastName'] && (
                                        <td className="py-2 px-4">
                                            {customer.title ? t(customer.title) + ' ' : ''}
                                            {customer.firstName} {customer.middleName || ''} {customer.lastName}
                                        </td>
                                    )}
                                    {visibleColumns['entity'] && (
                                        <td className="py-2 px-4">
                                            {Object.keys(customer.entity?.entityType?.fields || {}).map((fieldKey) => {
                                                const label = getTranslationForLocale(customer.entity!.entityType!, locale)[fieldKey] || fieldKey;
                                                const value = getTranslationForLocale(customer.entity!.entityType!, locale)[customer.entity!.fieldValues[fieldKey] || ''] || customer.entity!.fieldValues[fieldKey] || 'N/A';
                                                return <p key={fieldKey}>{label}: {value}</p>;
                                            })}
                                        </td>
                                    )}
                                    {visibleColumns['phoneNumber'] &&
                                        <td className="py-2 px-4">{customer.phoneNumber}</td>}
                                    {fieldKeys.map((key) =>
                                        visibleColumns[`additionalFields.${key}`] ? (
                                            <td key={`${customer.id}-${key}`} className="px-4 py-2">
                                                {customer.additionalFields?.[key] || 'N/A'}
                                            </td>
                                        ) : null
                                    )}
                                    <td className="py-2 px-4 space-x-2">
                                        {customer.isNonActive && <>Inactief</>}
                                        {!customer.isNonActive && (
                                            <div className="relative inline-block text-left">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center w-12 h-12 bg-transparent text-gray-600 rounded-full hover:bg-gray-200"
                                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                                >
                                                    <FiMoreHorizontal className="text-white"/>
                                                </button>
                                                {isMenuOpen && (
                                                    <div
                                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                                                        ref={menuRef}
                                                    >
                                                        <div className="py-1">
                                                            <button onClick={() => openEditor(customer, false)}
                                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100 w-full">
                                                                {t('edit')}
                                                            </button>
                                                            <button onClick={() => openDialog(customer)}
                                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100 w-full">
                                                                {t('delete')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
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
    );
}
