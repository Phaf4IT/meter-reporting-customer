import React, {useEffect, useState} from 'react';
import {getUnit, Tariff} from './tariff';
import {useLocale, useTranslations} from 'next-intl';
import {Campaign} from "@/components/admin/campaign/campaign";
import {currencies} from "@/components/admin/tariff/currencies";
import {MeasureValue, MeasureValueType} from "@/components/admin/measure-value/measureValue";
import DatePicker from 'react-date-picker';
import type {Value} from "@/node_modules/react-date-picker/dist/cjs/shared/types";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import '../custom-calendar.scss'
import {getTranslationForLocale} from "@/components/admin/entity-type/entityType";
import ToggleSwitch from "@/components/toggle-switch";

interface TariffFormProps {
    isNew: boolean;
    tariff?: Tariff;
    onClose: () => void;
    onSubmit: (tariff: Tariff) => void;
    campaigns?: Campaign[];
}

export const TariffForm: React.FC<TariffFormProps> = ({
                                                          tariff,
                                                          onSubmit,
                                                          isNew,
                                                          onClose,
                                                          campaigns,
                                                      }) => {
    const t = useTranslations('admin.tariff');
    const locale = useLocale();
    const [formData, setFormData] = useState<Tariff>(tariff || {
        id: '',
        campaignName: '',
        customerIds: [],
        description: '',
        rate: 0,
        currency: 'EUR',
        unit: getUnit('annual'),
        measureValueName: undefined,
        rangeFrom: undefined,
        rangeTo: undefined,
        validFrom: new Date(),
        validTo: undefined,
        isDeposit: false
    });
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>(undefined);
    const [measureValues, setMeasureValues] = useState<MeasureValue[]>([]);

    useEffect(() => {
        if (tariff) {
            setFormData(tariff); // Reset de formData naar de geselecteerde tarief
            setSelectedCampaign(campaigns?.find(c => c.name === tariff.campaignName))
        } else {
            setFormData({
                id: '',
                campaignName: '',
                customerIds: [],
                description: '',
                rate: 0,
                currency: 'EUR',
                unit: getUnit('annual'),
                measureValueName: undefined,
                rangeFrom: undefined,
                rangeTo: undefined,
                validFrom: new Date(),
                validTo: undefined,
                isDeposit: false
            }); // Reset voor een nieuw tarief
        }
    }, [campaigns, tariff]);

    useEffect(() => {
        if (selectedCampaign) {
            setMeasureValues(selectedCampaign.measureValues || []);
            // Automatically select all customers from the selected campaign
            setFormData(prevState => ({
                ...prevState,
                customerIds: selectedCampaign.customers.map(customer => customer.id),
            }));
        }
    }, [selectedCampaign]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prevState => ({...prevState, [e.target.name]: e.target.value}));
    };

    const handleToggleChange = (name: string, value: boolean) => {
        setFormData(prevState => ({...prevState, [name]: value}));
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prevState => ({...prevState, [e.target.name]: getUnit(e.target.value)}));
    }

    const setMeasureValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
            setFormData(prevState => ({...prevState, unit: getUnit('usage_based')}));
        } else {
            setFormData(prevState => ({...prevState, unit: getUnit('annual')}));
        }
        handleChange(e);
    };

    const setRate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedValue = parseFloat(e.target.value);
        setFormData(prevState => ({...prevState, [e.target.name]: isNaN(parsedValue) ? 0 : parsedValue}));
    }

    const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const campaignName = e.target.value;
        const campaign = campaigns?.find(c => c.name === campaignName);
        setSelectedCampaign(campaign);
        if (campaign) {
            setFormData({...formData, campaignName: campaign.name});
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    // Function to update the rangeFrom and rangeTo
    const handleDateChange = (name: string, value: Value) => {
        setFormData(prevState => ({...prevState, [name]: value || undefined}));
    };

    // Select or deselect all customers
    const toggleSelectAllCustomers = (selectAll: boolean) => {
        if (selectAll && selectedCampaign) {
            setFormData(prevState => ({
                ...prevState,
                customerIds: selectedCampaign.customers.map(customer => customer.id),
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                customerIds: [],
            }));
        }
    };

    const handleCustomerChange = (customerId: string) => {
        setFormData(prevState => {
            const newCustomerIds = prevState.customerIds.includes(customerId)
                ? prevState.customerIds.filter(id => id !== customerId)
                : [...prevState.customerIds, customerId];
            return {...prevState, customerIds: newCustomerIds};
        });
    };

    return (
        <form onSubmit={handleSubmit}
              className="w-full max-w-4xl bg-cyan-900 text-white p-6 rounded shadow-md space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">{isNew ? t('addTariff') : t('editTariff')}</h1>

                {/* Campaign Name select dropdown */}
                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('campaignName')}</label>
                    {campaigns && campaigns.length > 0 ? (
                        <select
                            name="campaignName"
                            value={formData.campaignName}
                            onChange={handleCampaignChange}
                            className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        >
                            <option value="" disabled>{t('selectCampaign')}</option>
                            {campaigns.map((campaign) => (
                                <option key={campaign.name} value={campaign.name}>
                                    {campaign.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-red-500">{t('noCampaignsAvailable')}</p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('description')}</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>

                {/* Rate */}
                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('rate')}</label>
                    <input
                        type="number"
                        name="rate"
                        value={formData.rate}
                        onChange={setRate}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>

                {/* Currency */}
                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('currency')}</label>
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    >
                        <option value="" disabled>{t('selectCurrency')}</option>
                        {currencies.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                                {currency.symbol} {t(`currencies.${currency.code}`)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Unit */}
                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('unit')}</label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleUnitChange}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    >
                        <option value="annual">{t('annual')}</option>
                        <option value="daily">{t('daily')}</option>
                        <option value="monthly">{t('monthly')}</option>
                        <option value="usage_based" disabled={!formData.measureValueName}>
                            {t('usageBased')}
                        </option>
                    </select>
                </div>

                {/* Measure Value */}
                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('measureValue')}</label>
                    <select
                        name="measureValueName"
                        value={formData.measureValueName || ''}
                        onChange={setMeasureValue}
                        disabled={!selectedCampaign}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    >
                        <option value="">{t('selectMeasureValue')}</option>
                        {measureValues.length > 0 && measureValues.filter(value => value.type !== MeasureValueType.PHOTO_UPLOAD)
                            .map((measureValue) => (
                                <option key={measureValue.name} value={measureValue.name}>
                                    {
                                        measureValue.translations
                                            .filter(translation => translation.locale.startsWith(locale))
                                            .map(translation => translation ? translation.value : measureValue.name)
                                            .find(() => true) || measureValue.name
                                    }
                                </option>
                            ))}
                    </select>
                </div>

                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('isDeposit')}</label>
                    <ToggleSwitch
                        isEnabled={formData.isDeposit}
                        onToggle={() => handleToggleChange('isDeposit', !formData.isDeposit)}
                    />
                </div>

                {/* Date Pickers for Range */}
                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('validFrom')}</label>
                    <DatePicker
                        className="bg-cyan-800 w-full p-2"
                        value={formData.validFrom}
                        onChange={value => handleDateChange('validFrom', value)}
                    />
                </div>

                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('validTo')}</label>
                    <DatePicker
                        className="bg-cyan-800 w-full p-2"
                        value={formData.validTo}
                        onChange={value => handleDateChange('validTo', value)}
                    />
                </div>

                {/* Range */}
                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('rangeFrom')}</label>
                    <input
                        type="number"
                        name="rangeFrom"
                        value={formData.rangeFrom ?? ''}
                        onChange={handleChange}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>

                <div className="space-y-4">
                    <label
                        className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('rangeTo')}</label>
                    <input
                        type="number"
                        name="rangeTo"
                        value={formData.rangeTo ?? ''}
                        onChange={handleChange}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>
            </div>

            {/* Right Column - Customers */}
            <div className="space-y-4">
                <label
                    className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">{t('customers')}</label>
                <div
                    className="flex flex-col max-h-48 overflow-y-auto bg-cyan-800 border border-gray-500 rounded p-4 space-y-2">
                    {selectedCampaign && selectedCampaign.customers.map((customer) => (
                        <div key={customer.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`customer-${customer.id}`}
                                checked={formData.customerIds.includes(customer.id)}
                                onChange={() => handleCustomerChange(customer.id)}
                                className="bg-cyan-900 text-white border-gray-500 rounded"
                            />
                            <label htmlFor={`customer-${customer.id}`}
                                   className="text-sm">{customer.firstName} {customer.lastName} {Object.keys(customer.entity?.entityType?.fields || []).map((fieldKey) => {
                                const fieldLabel = getTranslationForLocale(customer.entity!.entityType!, locale)[fieldKey] || fieldKey;
                                const fieldValue = getTranslationForLocale(customer.entity!.entityType!, locale)[customer.entity!.fieldValues[fieldKey] || 'N/A'] || customer.entity!.fieldValues[fieldKey] || 'N/A';
                                return (
                                    <span key={fieldKey}>
                                        {fieldLabel}: {fieldValue}
                                    </span>
                                )
                            })}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2 mt-2">
                    <button
                        type="button"
                        onClick={() => toggleSelectAllCustomers(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {t('selectAll')}
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleSelectAllCustomers(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        {t('deselectAll')}
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {isNew ? t('addTariff') : t('saveChanges')}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    {t('cancel')}
                </button>
            </div>
        </form>
    );
};
