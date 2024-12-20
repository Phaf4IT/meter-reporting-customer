'use client';

import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useEffect} from "react";
import {signout} from "@/app/success/signout";

export default function SuccessPage() {
    const t = useTranslations('success');
    const searchParams = useSearchParams();
    const gas = searchParams.get('gas');
    const water = searchParams.get('water');
    const light = searchParams.get('light');

    useEffect(() => {
        const logoutUser = async () => {
            // Wacht 3 seconden (of een andere gewenste tijd) voor uitloggen
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await signout();
        };

        logoutUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-950">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <p className="mb-4">{t('message')}</p>
            <div className="bg-cyan-900 p-6 rounded shadow-md">
                <p>
                    <strong>{t('gas')}:</strong> {gas} m³
                </p>
                <p>
                    <strong>{t('water')}:</strong> {water} m³
                </p>
                <p>
                    <strong>{t('light')}:</strong> {light} kWh
                </p>
            </div>
        </div>
    );
}
