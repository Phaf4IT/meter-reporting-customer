'use client';

import React, {useEffect, useState} from 'react';
import AdminLayout from '../adminlayout';
import {useTranslations} from 'next-intl';
import CampaignList from "@/components/admin/campaign/campaign-list";
import {Campaign} from "@/app/admin/campaign/campaign";
import {deleteCampaign, getCampaigns, saveCampaign} from "@/app/admin/campaign/client";
import CampaignFormWizard from "@/components/admin/campaign/campaign-formwizard";

export default function CampaignsPage() {
    const t = useTranslations('admin.campaign');

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        getCampaigns()
            .then(campaigns => setCampaigns(campaigns));
    }, []);

    const handleAddCampaign = async (campaign: Campaign) => {
        saveCampaign(campaign)
            .then(campaignToAdd => {
                setCampaigns((prev) => [...prev, campaignToAdd]);
                setIsDialogOpen(false);
            })
    };

    const handleDeleteCampaign = async (campaign: Campaign) => {
        deleteCampaign(campaign)
            .then(() => {
                setCampaigns((prev) => prev.filter((c) => c !== campaign));
            })
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t('pageTitle')}</h1>
                <CampaignList campaigns={campaigns} t={t} onDelete={handleDeleteCampaign}/>

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
                    onClick={() => setIsDialogOpen(true)}
                >
                    {t('addCampaignButton')}
                </button>
                <CampaignFormWizard
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSubmit={handleAddCampaign}
                    t={t}
                />
            </div>
        </AdminLayout>
    );
}
