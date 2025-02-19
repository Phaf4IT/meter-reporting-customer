import {additionalFields, Customer} from "@/components/admin/customer/customer";
import {Entity} from "@/components/admin/entity/entity";
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";
import React, {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {getTranslationForLocale} from "@/components/admin/entity-type/entityType";
import {useToaster} from "@/components/admin/toast-context";
import {Logger} from "@/lib/logger";

export default function EditableCustomerRow({
                                                customer,
                                                entities,
                                                isNew,
                                                onSave,
                                                onCancel
                                            }: {
    customer: Customer;
    entities: Entity[];
    isNew: boolean;
    onSave: (customer: ModifiableCustomer & Customer, isNew: boolean) => void;
    onCancel: () => void;
}) {
    const [editingCustomer, setEditingCustomer] = useState<ModifiableCustomer>({
        ...customer,
        title: customer.title || "",
        entityId: customer.entity?.id || "",
        phoneNumber: customer.phoneNumber || "",
        additionalFields: customer.additionalFields || {},
    });
    const t = useTranslations('admin.customer');
    const locale = useLocale();
    const additionalFieldCustomers = additionalFields();
    const [entityError, setEntityError] = useState<string>("");  // Foutmelding voor entiteitsselectie
    const toaster = useToaster();

    const handleInputChangeAdditionalField = (field: string, value: any) => {
        setEditingCustomer(prev => {
            const newAdditionalFields = prev ? prev.additionalFields || {} : {};
            newAdditionalFields[field] = value;
            return prev ? {...prev, additionalFields: newAdditionalFields} : prev;
        })
    };

    const handleInputChangeEntityField = (entityId: string) => {
        if (entityId) {
            setEntityError('');
        }
        setEditingCustomer(prev => {
            return prev ? {...prev, entityId: entityId, entity: entities.find(e => e.id === entityId)} : prev;
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        Logger.info("submitted");
        e.preventDefault();

        if (!editingCustomer.entityId) {
            toaster.showToaster(t("entityRequired"), 'error');
            setEntityError(t("entityRequired"));
            return;
        }

        onSave(editingCustomer, isNew);
    };

    return <>
        <td className="py-2 px-4">
            <form onSubmit={handleSubmit} id="customer-form"></form>
            <select
                id="title"
                value={editingCustomer.title}
                onChange={(e) => setEditingCustomer({
                    ...editingCustomer,
                    title: e.target.value
                })}
                className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                form="customer-form"
            >
                <option value="">{t("none")}</option>
                <option value="mr">{t("mr")}</option>
                <option value="mrs">{t("mrs")}</option>
                <option value="family">{t("family")}</option>
            </select>
        </td>
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
                form="customer-form"
            />
        </td>
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
                form="customer-form"
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
                form="customer-form"
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
                form="customer-form"
            />
        </td>
        <td className="py-2 px-4">
            <select
                onChange={(e) => handleInputChangeEntityField(e.target.value)}
                className={`appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded 
                py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400 ${entityError ? 'border-red-500' : ''}`}
                form="customer-form"
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
                form="customer-form"
            />
        </td>
        {Object.entries(additionalFieldCustomers.fields).map(([fieldKey, field]) => {
            const fieldType = field.type;
            const isRequired = field.required;

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
                                form="customer-form"
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
                                                            form="customer-form"
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
                                form="customer-form"
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
                                form="customer-form"
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
                                form="customer-form"
                            />
                        </td>
                    );

                default:
                    return null;
            }
        })}
        <td className="py-2 px-4 space-x-2">
            <button
                type="submit"
                form="customer-form"
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
                {t('save')}
            </button>
            <button
                onClick={() => onCancel()}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
                {t('cancel')}
            </button>
        </td>
    </>
}