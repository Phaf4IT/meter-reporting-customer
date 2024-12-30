import React, {useEffect, useState} from 'react';
import {getCampaignOptions, report} from '@/app/report/client';
import {useRouter, useSearchParams} from 'next/navigation';
import {MeasureValue as DetailedMeasureValue} from '@/components/admin/measure-value/measureValue';
import useFormData from '@/hooks/useFormData';
import ToggleSwitch from '@/components/toggle-switch';
import {Logger} from "@/lib/logger";
import {useTranslations, useLocale} from "next-intl";

export default function CampaignForm() {
    const t = useTranslations('form');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [campaigns, setCampaigns] = useState<any>(null); // type Campaign | null
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const locale = useLocale();

    const {formData, handleChange, resetForm} = useFormData('formCampaign');

    const handleFormSubmit = async (formData: Record<string, string>, token: string) => {
        try {
            const customerMeasurement = {
                measurements: Object.entries(formData).map(([name, value]) => ({
                    name,
                    value,
                })),
                dateTime: new Date(),
            };

            await report(customerMeasurement, token, router);
        } catch (err: any) {
            Logger.error(err)
            setError(err.message || 'Er ging iets mis');
        }
    };

    useEffect(() => {
        if (token) {
            getCampaignOptions(token, router)
                .then((campaign) => {
                    if (campaign) {
                    setCampaigns(campaign);
                    }
                })
                .catch((reason) => {
                    Logger.error(reason);
                    setError(reason.message || 'Er ging iets mis');
                });
        }
    }, [token, router]);

    useEffect(() => {
        if (campaigns) {
            campaigns.measureValues.forEach((measure: DetailedMeasureValue) => {
                if (!(measure.name in formData)) {
                    formData[measure.name] = measure.defaultValue || '';
                }
            });
        }
    }, [campaigns, formData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (token) {
            await handleFormSubmit(formData, token);
            resetForm();
        }
    };

    const getTranslationOrDefault = (measure: DetailedMeasureValue) => {
        const translation = measure.translations.find((value) => value.locale === locale);
        return translation ? translation.value : measure.name;
    };

    return (
        <div>
            {campaigns ? (
                <form onSubmit={handleSubmit} className="bg-cyan-900 p-6 rounded shadow-md">
                    {campaigns.measureValues.map((measure: DetailedMeasureValue) => (
                        <div key={measure.name} className="mb-4">
                            <label htmlFor={measure.name} className="block font-medium">
                                {getTranslationOrDefault(measure)}
                            </label>

                            {/* Handle Boolean Type */}
                            {measure.type === 'BOOLEAN' ? (
                                <ToggleSwitch
                                    isEnabled={formData[measure.name] === 'true'} // Assuming formData stores 'true'/'false' as strings
                                    onToggle={() => {
                                        handleChange({
                                            target: {
                                                name: measure.name,
                                                value: formData[measure.name] === 'true' ? 'false' : 'true',
                                            },
                                        } as React.ChangeEvent<HTMLInputElement>);
                                    }}
                                    disabled={!measure.isEditable} // Disable if not editable
                                />
                            ) : (
                            <input
                                type={measure.type === 'NUMBER' ? 'number' : 'text'}
                                id={measure.name}
                                name={measure.name}
                                value={formData[measure.name] || ''}
                                onChange={handleChange}
                                required={measure.isEditable}
                                    disabled={!measure.isEditable} // Disable if not editable
                                className="border rounded w-full p-2 text-gray-900"
                            />
                            )}
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {t('submit')}
                    </button>
                </form>
            ) : (
                <>
                    {error ? (<p className="text-red-500 mt-4">{error}</p>) : (
                        <p>{t('loading')}</p>)
                    }
                </>
            )}
        </div>
    );
}
