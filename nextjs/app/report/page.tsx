'use client';
import React, {Suspense, useState} from 'react';
import {useTranslations} from 'next-intl';
import {report} from '@/app/report/client';
import LanguageSwitcher from '@/app/languageswitcher';
import CampaignForm from "@/app/report/campaignForm";
import {useRouter} from "next/navigation";

export default function FormPage() {
    const t = useTranslations('form');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
            setError(err.message || 'Er ging iets mis.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-950">
            <LanguageSwitcher/>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <Suspense>
                <CampaignForm
                    onSubmit={handleFormSubmit}
                    onError={(message) => setError(message)}
                />
            </Suspense>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
