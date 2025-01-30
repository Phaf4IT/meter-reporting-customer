'use client';

import React, {useEffect, useState} from 'react';
import AdminLayout from '../adminlayout';
import {useTranslations} from 'next-intl';
import CampaignList from "@/components/admin/campaign/campaign-list";
import {Campaign} from "@/components/admin/campaign/campaign";
import {deleteCampaign, getCampaigns, saveCampaign} from "@/app/admin/campaign/client";
import CampaignFormWizard from "@/components/admin/campaign/campaign-formwizard";
import {CampaignConfiguration} from "@/components/admin/campaign-configuration/campaignConfiguration";
import {getCampaignConfigurations, saveCampaignConfiguration} from "@/app/admin/campaign-configuration/client";
import {ModifiableCampaign} from "@/app/api/admin/campaign/route";
import CampaignConfigurationFormWizard from "@/components/admin/campaign/campaign-configuration-formwizard";

export default function CampaignsPage() {
    const t = useTranslations('admin.campaign');

    const [campaignConfigurations, setCampaignConfigurations] = useState<CampaignConfiguration[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
    const [isCampaignConfigurationDialogOpen, setIsCampaignConfigurationDialogOpen] = useState(false);
    const [selectedCampaignConfiguration, setSelectedCampaignConfiguration] = useState<CampaignConfiguration>();

    useEffect(() => {
        getCampaigns()
            .then(campaigns => setCampaigns(campaigns));
        getCampaignConfigurations()
            .then(configs => setCampaignConfigurations(configs));
    }, []);

    const handleAddCampaign = async (campaign: ModifiableCampaign) => {
        saveCampaign(campaign)
            .then(campaignToAdd => {
                setCampaigns((prev) => [...prev, campaignToAdd]);
                setIsCampaignDialogOpen(false);
                setSelectedCampaignConfiguration(undefined)
            })
    };

    const handleAddCampaignConfiguration = async (campaign: CampaignConfiguration) => {
        saveCampaignConfiguration(campaign)
            .then(campaignToAdd => {
                setCampaignConfigurations((prev) => [...prev, campaignToAdd]);
                setIsCampaignDialogOpen(false);
                setSelectedCampaignConfiguration(undefined)
            })
    };

    const handleDeleteCampaign = async (campaign: Campaign) => {
        deleteCampaign(campaign)
            .then(() => {
                setCampaigns((prev) => prev.filter((c) => c !== campaign));
            })
    };

    const openNewCampaign = async (campaignConfiguration: CampaignConfiguration) => {
        setIsCampaignDialogOpen(true);
        setSelectedCampaignConfiguration(campaignConfiguration);
    }

    const openNewCampaignConfiguration = async () => {
        setIsCampaignConfigurationDialogOpen(true);
    }

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t('pageTitle')}</h1>
                <CampaignList campaigns={campaigns} t={t} onDelete={handleDeleteCampaign}
                              campaignConfigurations={campaignConfigurations} openNewCampaign={openNewCampaign}/>

                <button
                    onClick={openNewCampaignConfiguration}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
                >
                    {t('addCampaignConfiguration')}
                </button>

                <CampaignFormWizard
                    isOpen={isCampaignDialogOpen}
                    onClose={() => setIsCampaignDialogOpen(false)}
                    onSubmit={handleAddCampaign}
                    currentCampaignNames={campaigns.map(value => value.name)}
                    currentCampaigns={campaigns.filter(value => value.configurationName === selectedCampaignConfiguration?.name)}
                    selectedCampaignConfiguration={selectedCampaignConfiguration}
                    t={t}
                />

                <CampaignConfigurationFormWizard
                    isOpen={isCampaignConfigurationDialogOpen}
                    onClose={() => setIsCampaignConfigurationDialogOpen(false)}
                    onSubmit={handleAddCampaignConfiguration}
                    t={t}
                    currentCampaignConfigurationNames={campaignConfigurations.map(value => value.name)}/>


            </div>
        </AdminLayout>
    );
}
