import React, {useEffect, useState} from 'react';
import {Tariff} from './tariff';
import {useLocale, useTranslations} from 'next-intl';
import {Campaign} from "@/components/admin/campaign/campaign";
import {currencies} from "@/components/admin/tariff/currencies";
import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import DatePicker from 'react-date-picker';
import type {Value} from "@/node_modules/react-date-picker/dist/cjs/shared/types";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import '../custom-calendar.scss'

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
        unit: 'annual',
        measureValueName: undefined,
        rangeFrom: undefined,
        rangeTo: undefined,
        validFrom: new Date(),
        validTo: undefined,
    });
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>(undefined);
    const [measureValues, setMeasureValues] = useState<MeasureValue[]>([]);

    useEffect(() => {
        if (selectedCampaign) {
            setMeasureValues(selectedCampaign.measureValues || []);
        }
    }, [selectedCampaign]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prevState => ({...prevState, [e.target.name]: e.target.value}));
    };

    const setMeasureValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
            setFormData(prevState => ({...prevState, unit: 'usage_based'}));
        } else {
            setFormData(prevState => ({...prevState, unit: 'annual'}));
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

    return (
        <form onSubmit={handleSubmit}
              className="w-full max-w-lg bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-bold">{isNew ? t('addTariff') : t('editTariff')}</h1>
            {tariff?.id}
            {formData?.id}
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
                    onChange={handleChange}
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
                    {measureValues.length > 0 && measureValues.map((measureValue) => (
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
