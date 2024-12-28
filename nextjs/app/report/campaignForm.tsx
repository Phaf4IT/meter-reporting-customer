// components/CampaignForm.tsx
import {useEffect, useState} from 'react';
import {getCampaignOptions} from '@/app/report/client';
import {useRouter, useSearchParams} from 'next/navigation';
import {MeasureValue as DetailedMeasureValue} from '@/components/admin/measure-value/measureValue';

interface CampaignFormProps {
    onSubmit: (formData: Record<string, string>, token: string) => void;
    onError: (error: string) => void;
}

export default function CampaignForm({onSubmit, onError}: CampaignFormProps) {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [campaigns, setCampaigns] = useState<any>(null); // type Campaign | null
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (token) {
            getCampaignOptions(token, router)
                .then((campaign) => {
                    setCampaigns(campaign);
                    const initialFormData: Record<string, string> = {};
                    campaign.measureValues.forEach((measure: DetailedMeasureValue) => {
                        initialFormData[measure.name] = measure.defaultValue || '';
                    });
                    setFormData(initialFormData);
                })
                .catch((reason) => {
                    setError(reason.message || 'Er ging iets mis');
                    onError(reason.message || 'Er ging iets mis');
                });
        }
    }, [router, token, onError]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (token) {
            onSubmit(formData, token);
        }
    };

    const getTranslationOrDefault = (measure: DetailedMeasureValue) => {
        const translation = measure.translations.find((value) => value.locale === 'nl');
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
                        Verzend
                    </button>
                </form>
            ) : (
                <p>{error || 'Laden...'}</p>
            )}
        </div>
    );
}
