import React, {useState} from "react";
import {Customer} from "@/components/admin/customer/customer";
import {getTranslationForLocale} from "@/components/admin/entity-type/entityType";
import {useLocale} from "next-intl";

interface CustomerSelectionProps {
    t: (key: string) => string;
    customers: Customer[];
    selectedCustomers: Customer[];
    setSelectedCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerSelection = ({
                               t,
                               customers,
                               selectedCustomers,
                               setSelectedCustomers,
                           }: CustomerSelectionProps) => {

    const locale = useLocale();
    const [query, setQuery] = useState('');

    // Filter klanten op basis van de zoekterm
    const filteredCustomers = query === ''
        ? customers
        : customers.filter((customer) => {
            // Zoek naar de zoekterm in de e-mail en naam
            const inEmailOrName = customer.email.toLowerCase().includes(query.toLowerCase()) ||
                `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query.toLowerCase());

            // Zoek naar de zoekterm in de velden van de entiteit
            const inEntityFields = Object.keys(customer.entity?.entityType?.fields || {}).some((fieldKey) => {
                const fieldValue = customer.entity!.fieldValues[fieldKey];

                // Check of de waarde van het veld een string is voordat we toLowerCase aanroepen
                if (typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(query.toLowerCase())) {
                    return true;
                }

                // Als het geen string is, controleer dan of het veld een object of array bevat dat de zoekterm kan bevatten
                if (fieldValue && typeof fieldValue === 'object') {
                    return JSON.stringify(fieldValue).toLowerCase().includes(query.toLowerCase());
                }

                return false;
            });

            return inEmailOrName || inEntityFields;
        });

    const toggleCustomerSelection = (customer: Customer) => {
        setSelectedCustomers((prev: Customer[]) =>
            prev.includes(customer)
                ? prev.filter((c) => c !== customer)
                : [...prev, customer]
        );
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">{t('customerEmails')}</h2>

            {/* Zoekbalk */}
            <div className="mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-700 text-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder={t('search')}
                />
            </div>

            {/* Scrollbare klantenlijst */}
            <div className="space-y-3 max-h-72 overflow-y-auto">
                {filteredCustomers.length === 0 && (
                    <p className="text-gray-400">{t('noResults')}</p>
                )}
                {filteredCustomers.map((customer: Customer) => (
                    <div key={`${customer.id}`}
                         className="flex items-center space-x-3 bg-gray-700 p-2 rounded-lg hover:bg-gray-600">
                        <input
                            type="checkbox"
                            id={customer.email}
                            checked={!!selectedCustomers.find((c: Customer) => c.email === customer.email)}
                            onChange={() => toggleCustomerSelection(customer)}
                            className="form-checkbox h-5 w-5 text-cyan-500"
                        />
                        <label htmlFor={customer.email} className="text-white w-full">
                            {/* Klantinformatie */}
                            <p className="truncate">
                                <span
                                    className="font-semibold">{t('name')}:</span> {customer.title} {customer.firstName} {customer.middleName} {customer.lastName}
                            </p>
                            <p className="truncate">
                                <span className="font-semibold">{t('email')}:</span> {customer.email}
                            </p>
                            <p className="truncate">
                                <span className="font-semibold">{t('phoneNumber')}:</span> {customer.phoneNumber}
                            </p>

                            {/* Entiteit gerelateerde velden */}
                            {Object.keys(customer.entity?.entityType?.fields || []).map((fieldKey) => {
                                const fieldLabel = getTranslationForLocale(customer.entity!.entityType!, locale)[fieldKey] || fieldKey;
                                return (
                                    <p key={fieldKey} className="truncate">
                                        <span
                                            className="font-semibold">{fieldLabel}:</span> {customer.entity!.fieldValues[fieldKey] || 'N/A'}
                                    </p>
                                );
                            })}
                        </label>
                    </div>
                ))}
            </div>

            {/* Selecteren / Reset-knoppen */}
            <div className="mt-6 flex space-x-4">
                <button
                    type="button"
                    onClick={() => setSelectedCustomers(customers)}
                    className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    {t('selectAll')}
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedCustomers([])}
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    {t('reset')}
                </button>
            </div>
        </div>
    );
};

export default CustomerSelection;
