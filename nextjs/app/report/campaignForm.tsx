import React, {useEffect, useState} from 'react';
import {getCampaignOptions, report} from '@/app/report/client';
import {useRouter, useSearchParams} from 'next/navigation';
import {MeasureValue as DetailedMeasureValue, MeasureValueType} from '@/components/admin/measure-value/measureValue';
import useFormData from '@/hooks/useFormData';
import ToggleSwitch from '@/components/toggle-switch';
import {Logger} from "@/lib/logger";
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";

export default function CampaignForm() {
    const t = useTranslations('form');
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');
    const [campaigns, setCampaigns] = useState<any>(null); // type Campaign | null
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const locale = useLocale();

    const {formData, handleChange, resetForm, handleFileChange} = useFormData('formCampaign');

    const handleFormSubmit = async (formData: Record<string, string | undefined>, token: string) => {
        try {
            const customerMeasurement = {
                measurements: await Promise.all(Object.entries(formData).map(async ([name, value]) => {
                    return {name, value};
                })),
                dateTime: new Date(),
            };

            await report(customerMeasurement, token, router);
        } catch (err: any) {
            Logger.error(err);
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
        const translation = measure.translations.find((value) => value.locale.split(/[-_]/)[0] === locale);
        return translation ? translation.value : measure.name;
    };

    const getInputType = (type: MeasureValueType) => {
        switch (type) {
            case MeasureValueType.NUMBER:
                return 'number';
            case MeasureValueType.TEXT:
                return 'text';
        }
    }

    const getInput = (measure: DetailedMeasureValue) => {
        switch (measure.type) {
            case MeasureValueType.TEXT:
            case MeasureValueType.NUMBER:
                return (<input
                    type={getInputType(measure.type)}
                    id={measure.name}
                    name={measure.name}
                    value={formData[measure.name] || ''}
                    onChange={handleChange}
                    required={measure.isEditable}
                    disabled={!measure.isEditable}
                    className="border rounded w-full p-2 text-gray-900"
                />);
            case MeasureValueType.BOOLEAN:
                return (
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
                );
            case MeasureValueType.PHOTO_UPLOAD:
                return (
                    <><input
                        type={'file'}
                        id={measure.name}
                        name={measure.name}
                        onChange={handleFileChange}
                        required={measure.isEditable}
                        disabled={!measure.isEditable}
                        accept="image/jpeg,image/png"
                        className="border rounded w-full p-2 text-gray-900"
                    />
                        {formData[measure.name] ? <Image
                            src={formData[measure.name]!}
                            alt={measure.name}
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="w-full h-auto"
                        /> : ''}
                    </>
                );
        }
    }

    return (
        <div>
            {campaigns ? (
                <form onSubmit={handleSubmit} className="bg-cyan-900 p-6 rounded shadow-md">
                    {campaigns.measureValues.map((measure: DetailedMeasureValue) => (
                        <div key={measure.name} className="mb-4">
                            <label htmlFor={measure.name} className="block font-medium">
                                {getTranslationOrDefault(measure)}
                            </label>
                            {
                                getInput(measure)
                            }
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
