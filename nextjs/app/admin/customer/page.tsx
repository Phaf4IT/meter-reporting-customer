'use client';

import React, {useEffect, useState} from 'react';
import {useLocale, useTranslations} from "next-intl";
import {additionalFields, Customer as C} from "@/components/admin/customer/customer";
import "@/components/dialog-styles.css";
import {getCustomers, getNonActiveCustomers, saveCustomer} from "@/app/admin/customer/client";
import {getAllEntities} from "@/app/admin/entity/client";
import {Entity} from "@/components/admin/entity/entity";
import {ColumnDef} from "@tanstack/react-table";
import {DataTable} from "@/components/ui/editable-table";
import {getTranslationForLocale} from "@/components/admin/entity-type/entityType";

export interface Customer extends C {
    id: string;
    email: string;
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    entity?: Entity;
    additionalFields?: any;
    isNonActive: boolean;
}

export default function CustomersPage() {
    const t = useTranslations('admin.customer');
    const locale = useLocale();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);

    const additionalFieldCustomers = additionalFields();
    const fieldKeys = Object.keys(additionalFieldCustomers.fields || {});

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

    const handleSave = async (updatedData: Customer[]) => {
        const updatedCustomers = await Promise.all(
            updatedData.map(async (customer) => {
                const saved = await saveCustomer(customer, false);
                return {...saved, entity: customer.entity, isNonActive: false};
            })
        );
        setCustomers(updatedCustomers);
    };

    const getTranslationForLocaleFields = (locale: string) => {
        const lang = locale.split('-')[0];
        const key = Object.keys(additionalFieldCustomers?.translations || {}).find(k => k.startsWith(lang));
        return key ? additionalFieldCustomers.translations[key] : additionalFieldCustomers.translations['en-US'];
    };

    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: 'email',
            header: t('email'),
            cell: info => info.getValue()
        },
        {
            accessorKey: 'title',
            header: t('title'),
            cell: info => info.getValue(),
            meta: {
                type: 'select',
                options: [
                    {value: 'none', label: t('none')},
                    {value: 'mr', label: t('mr')},
                    {value: 'mrs', label: t('mrs')},
                    {value: 'family', label: t('family')}
                ]
            }
        },
        {
            accessorKey: 'firstName',
            header: t('firstName'),
            cell: info => info.getValue()
        },
        {
            accessorKey: 'middleName',
            header: t('middleName'),
            cell: info => info.getValue()
        },
        {
            accessorKey: 'lastName',
            header: t('lastName'),
            cell: info => info.getValue()
        },
        ...(Object.keys(customers[0]?.entity?.entityType?.fields || {}).map((fieldKey) =>
            ({
                id: `entity.fieldValues.${fieldKey}`,
                accessorFn: (row: Customer) => row.entity?.fieldValues?.[fieldKey] ?? '',
                header: getTranslationForLocale(locale, customers[0]?.entity?.entityType)?.[fieldKey] || fieldKey,
                meta: {
                    type: 'select',
                    options: entities.map(entity => ({
                        value: `${
                            Object.keys(entity.entityType?.fields || []).map((fieldKey) => {
                                const fieldValue = getTranslationForLocale(locale, entity.entityType!)![entity.fieldValues[fieldKey] || 'N/A'] || entity.fieldValues[fieldKey] || 'N/A';
                                return `${fieldValue}`
                            })
                        }`,
                        label: `${
                            Object.keys(entity.entityType?.fields || []).map((fieldKey) => {
                                const fieldValue = getTranslationForLocale(locale, entity.entityType!)![entity.fieldValues[fieldKey] || 'N/A'] || entity.fieldValues[fieldKey] || 'N/A';
                                return `${fieldValue}`
                            })
                        }`
                    }))
                },
                cell: (info: any) => {
                    const rawValue = info.getValue();
                    const translations = getTranslationForLocale(locale, info.row.original.entity?.entityType);
                    return translations?.[rawValue] || rawValue || 'N/A';
                }
            })) as ColumnDef<Customer>[])
        ,
        ...fieldKeys.map((key) => {
            const field = additionalFieldCustomers.fields[key];
            const translation = getTranslationForLocaleFields(locale)?.[key] || key;

            const meta: any = {type: 'text', required: field.required};

            switch (field.type) {
                case 'text[]':
                    meta.type = 'textarea';
                    break;
                case 'numeric':
                    meta.type = 'number';
                    break;
                case 'boolean':
                    meta.type = 'checkbox';
                    break;
                case 'date':
                    meta.type = 'date';
                    break;
            }

            return {
                id: `additionalFields.${key}`,
                accessorKey: `additionalFields.${key}`,
                header: translation,
                cell: (info: any) => {
                    const value = info.getValue();
                    if (field.type === 'boolean') {
                        return value ? '✓' : '✗';
                    }
                    if (Array.isArray(value)) {
                        return value.join(', ');
                    }
                    return value ?? '';
                },
                meta
            } satisfies ColumnDef<Customer>;
        })
    ];

    return (
        <div className="min-h-screen p-8 bg-cyan-950 text-white">
            <h1 className="text-2xl font-bold mb-6">{t('manageCustomers')}</h1>
            <DataTable columns={columns} data={customers} onSaveAction={handleSave}/>
        </div>
    );
}
