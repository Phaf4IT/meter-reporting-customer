import React, {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {CustomerMeasurement, MeasureValue} from "@/components/admin/customer-measurement/customerMeasurement";
import ToggleSwitch from '@/components/toggle-switch';
import {Campaign} from "@/components/admin/campaign/campaign";
import {MeasureValue as CampaignMeasureValue} from "@/components/admin/measure-value/measureValue";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';
import type {Value} from "@/node_modules/react-date-picker/dist/cjs/shared/types";
import '../custom-calendar.scss'

export interface CustomerMeasurementCampaign {
    customerMeasurement: CustomerMeasurement;
    campaign: Campaign;
}

interface CustomerMeasurementFormProps {
    customerMeasurementCampaign?: CustomerMeasurementCampaign;
    onSave: (measurement: CustomerMeasurement) => void;
    isOverruling: boolean;
    onCancel: () => void;
}

export default function CustomerMeasurementForm({
                                                    customerMeasurementCampaign,
                                                    onSave,
                                                    isOverruling,
                                                    onCancel,
                                                }: CustomerMeasurementFormProps) {
    const t = useTranslations('admin.customerMeasurement');
    const locale = useLocale();

    const [formData, setFormData] = useState<{ [key: string]: string | boolean }>({});
    const [measurements, setMeasurements] = useState<MeasureValue[]>([]);
    const [dateTime, setDateTime] = useState<Value>();

    useEffect(() => {
        if (customerMeasurementCampaign?.campaign && customerMeasurementCampaign.customerMeasurement) {
            const combinedMeasurements = customerMeasurementCampaign.campaign.measureValues.map((campaignMeasure: CampaignMeasureValue) => {

                const existingMeasurement = customerMeasurementCampaign.customerMeasurement.measurements.find(
                    (measurement) => measurement.name === campaignMeasure.name
                );
                return {
                    ...campaignMeasure,
                    value: existingMeasurement ? existingMeasurement.value : campaignMeasure.defaultValue || '',
                };
            });

            setDateTime(customerMeasurementCampaign.customerMeasurement.dateTime);

            setMeasurements(combinedMeasurements);


            const newFormData: { [key: string]: string | boolean } = {};
            combinedMeasurements.forEach((measure) => {
                newFormData[measure.name] = measure.value || '';
            });
            setFormData(newFormData);
        }
    }, [customerMeasurementCampaign]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const updatedMeasurements: MeasureValue[] = measurements.map((measure) => ({
            name: measure.name,
            value: `${formData[measure.name] || measure.value}`,
        }));


        const measurement = {
            ...customerMeasurementCampaign!.customerMeasurement,
            measurements: updatedMeasurements,
            dateTime: new Date(dateTime!.toLocaleString())
        };
        onSave(measurement);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };


    const getTranslationOrDefault = (measure: CampaignMeasureValue) => {
        const translation = measure.translations.find((value) => value.locale.split(/[-_]/)[0] === locale);
        return translation ? translation.value : measure.name;
    };

    const onClose = () => {
        setFormData({});
        setMeasurements([]);
        setDateTime(undefined)
        onCancel();
    }

    return (
        <form onSubmit={handleSubmit} className="bg-cyan-900 p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">
                {`${isOverruling ? t('overruleMeasurements') : t('createMeasurements')} ${customerMeasurementCampaign!.campaign.name} (${customerMeasurementCampaign!.customerMeasurement.customerMail})`}
            </h2>

            {customerMeasurementCampaign?.campaign.measureValues.map((measure) => (
                <div key={measure.name} className="mb-4">
                    <label htmlFor={measure.name} className="block font-medium">
                        {getTranslationOrDefault(measure)}
                    </label>

                    {measure.type === 'BOOLEAN' ? (
                        <ToggleSwitch
                            isEnabled={formData[measure.name] === 'true'}
                            onToggle={() => {
                                setFormData({
                                    ...formData,
                                    [measure.name]: formData[measure.name] === 'true' ? 'false' : 'true',
                                });
                            }}
                            disabled={!measure.isEditable}
                        />
                    ) : (
                        <input
                            type={measure.type === 'NUMBER' ? 'number' : 'text'}
                            id={measure.name}
                            name={measure.name}
                            value={`${formData[measure.name]}` || ''}
                            onChange={handleChange}
                            required={measure.isEditable}
                            disabled={!measure.isEditable}
                            className="border rounded w-full p-2 text-gray-900"
                        />
                    )}

                    {measure.unit && (
                        <span className="text-sm text-gray-400"> ({measure.unit})</span>
                    )}
                </div>
            ))}
            <div className="mb-4">
                <label htmlFor={'dateTime'} className="block font-medium">
                    {t('measureDate')}
                </label>
                <DatePicker
                    className="bg-cyan-800 w-full p-2"
                    value={dateTime}
                    onChange={value => setDateTime(value || undefined)}
                />
            </div>

            <div className="mt-4">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {t('submit')}
                </button>
                <button type="button" onClick={onClose}
                        className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    {t('cancel')}
                </button>
            </div>
        </form>
    );
}
