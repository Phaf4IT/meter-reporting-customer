'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {signOutAction} from "@/app/success/signOutAction";
import {Campaign} from "@/components/report/campaign";
import {MeasureValue as DetailedMeasureValue} from "@/components/admin/measure-value/measureValue";
import {getCampaignOptions} from "@/app/report/client";

export default function SuccessPage() {
    const t = useTranslations('success');
    const searchParams = useSearchParams();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [measureValues, setMeasureValues] = useState<DetailedMeasureValue[]>([]);
    const [measurements, setMeasurements] = useState<{ name: string, value: string }[]>([]);
    const locale = useLocale();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            getCampaignOptions(token)
                .then((campaignData) => {
                    setCampaign(campaignData);
                    setMeasureValues(campaignData.measureValues);
                });
        }

        // Haal de metingen op van de zoekparameters
        const allMeasurements: { name: string, value: string }[] = [];
        searchParams.forEach((value, key) => {
            if (key !== 'token') {  // We slaan de token over
                allMeasurements.push({name: key, value});
            }
        });
        setMeasurements(allMeasurements);
    }, [searchParams]);

    useEffect(() => {
        const logoutUser = async () => {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await signOutAction();
        };
        logoutUser();
    }, []);

    // Functie om de vertaling te krijgen op basis van de 'name' en locale
    const getTranslation = (measureName: string): string => {
        const measure = measureValues.find(m => m.name === measureName);
        if (measure) {
            const translation = measure.translations.find(t => t.locale === locale);
            return translation ? translation.value : measureName;
        }
        return measureName;  // Als er geen vertaling is, gebruik dan de naam
    };

    // Functie om de eenheid te krijgen van de bijbehorende measure
    const getUnit = (measureName: string): string | undefined => {
        const measure = measureValues.find(m => m.name === measureName);
        return measure?.unit;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-950">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <p className="mb-4">{t('message')}</p>
            <div className="bg-cyan-900 p-6 rounded shadow-md">
                {campaign ? (
                    <>
                        {measurements.length > 0 ? (
                            measurements.map((measurement) => (
                                <div key={measurement.name} className="mb-4">
                                    <p>
                                        <strong>{getTranslation(measurement.name)}:</strong> {measurement.value} {getUnit(measurement.name)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>{t('noMeasurements')}</p>
                        )}
                    </>
                ) : (
                    <p>{t('loading')}</p>
                )}
            </div>
        </div>
    );
}
