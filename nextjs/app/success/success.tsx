import {useLocale, useTranslations} from "next-intl";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Report} from "@/app/api/report/report";
import {getReport} from "@/app/report/client";
import {signOutAction} from "@/app/success/signOutAction";
import {MeasureValueTranslation} from "@/components/admin/measure-value/measureValue";

export default function Success() {
    const t = useTranslations('success');
    const searchParams = useSearchParams();
    const [campaign, setCampaign] = useState<Report | null>(null);
    const locale = useLocale();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            getReport(token)
                .then((report) => {
                    setCampaign(report);
                });
        }
    }, [searchParams]);

    useEffect(() => {
        const logoutUser = async () => {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await signOutAction();
        };
        logoutUser();
    }, []);

    // Functie om de vertaling te krijgen op basis van de 'name' en locale
    const getTranslation = (measureName: string, measureTranslations: MeasureValueTranslation[]): string => {
        const translation = measureTranslations.find(t => t.locale === locale);
        return translation ? translation.value : measureName;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-950">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <p className="mb-4">{t('message')}</p>
            <div className="bg-cyan-900 p-6 rounded shadow-md">
                {campaign ? (
                    <>
                        {campaign.measureValues.length > 0 ? (
                            campaign.measureValues.map((measurement) => (
                                <div key={measurement.name} className="mb-4">
                                    <p>
                                        <strong>{getTranslation(measurement.name, measurement.translations)}:</strong> {measurement.value} {measurement.unit}
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