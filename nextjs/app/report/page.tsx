'use client';
import React, {Suspense} from 'react';
import LanguageSwitcher from '@/app/languageswitcher';
import CampaignForm from "@/app/report/campaignForm";
import {useTranslations} from "next-intl";

export default function FormPage() {
    const t = useTranslations('form');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-950">
            <LanguageSwitcher/>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <Suspense>
                <CampaignForm/>
            </Suspense>
        </div>
    );
}
