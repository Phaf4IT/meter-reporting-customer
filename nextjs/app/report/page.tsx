'use client';
import {FormEvent, useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import LanguageSwitcher from "@/app/languageswitcher";
import {getCampaignOptions, report} from "@/app/report/client";
import {MeasureValue as DetailedMeasureValue} from "@/app/admin/measure-value/measureValue";
import {Campaign} from "@/app/report/campaign";
import {CustomerMeasurement} from "@/app/report/customerMeasurement";

export default function FormPage() {
    const t = useTranslations('form');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const locale = useLocale();

    const [formData, setFormData] = useState<Record<string, string>>({});
    const [campaigns, setCampaigns] = useState<Campaign | null>(null);
    const [, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            getCampaignOptions(token).then((campaign) => {
                setCampaigns(campaign);

                const initialFormData: Record<string, string> = {};
                campaign.measureValues.forEach((measure: DetailedMeasureValue) => {
                    initialFormData[measure.name] = measure.defaultValue || '';
                });
                setFormData(initialFormData);
            });
        }
    }, [token]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const customerMeasurement: CustomerMeasurement = {
                measurements: Object.entries(formData).map(([name, value]) => ({
                    name,
                    value
                })),
                dateTime: new Date(),
            };

            await report(customerMeasurement, token!);

            router.push(
                `/success?${Object.entries(formData)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&')}&token=${token}`
            );
        } catch (err: any) {
            setError(err.message || 'Er ging iets mis.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        // Update de formData
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    function getTranslationOrDefault(measureValue: DetailedMeasureValue) {
        const translation = measureValue.translations.find((value) => value.locale === locale);
        return translation ? translation.value : measureValue.name;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  bg-cyan-950">
            <LanguageSwitcher/>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>

            {campaigns ? (
                <form onSubmit={handleSubmit} className=" bg-cyan-900 p-6 rounded shadow-md">
                    {campaigns.measureValues.map((measure: DetailedMeasureValue) => (
                        <div key={measure.name} className="mb-4">
                            <label htmlFor={measure.name} className="block font-medium">
                                {getTranslationOrDefault(measure)}
                            </label>
                            <input
                                type={measure.type === 'NUMBER' ? 'number' : 'text'}
                                id={measure.name}
                                name={measure.name}
                                value={formData[measure.name] || ''}
                                onChange={handleChange}
                                required={measure.isEditable}
                                className="border rounded w-full p-2 text-gray-900"
                            />
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
                <p>{t('loading')}</p>
            )}
        </div>
    );
}
