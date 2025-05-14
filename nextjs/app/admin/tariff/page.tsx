// pages/admin/tariff-management.tsx
"use client"

import React, {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {deleteTariff, getTariffs, saveTariff} from '@/app/admin/tariff/client';
import {TariffTable} from '@/components/admin/tariff/tariff-table';
import {TariffForm} from '@/components/admin/tariff/tariff-form';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';
import '@/components/dialog-styles.css';
import {Logger} from "@/lib/logger";
import {Tariff} from "@/components/admin/tariff/tariff";
import {getCampaigns} from '../campaign/client';
import {Campaign} from "@/components/admin/campaign/campaign";

export default function TariffManagementPage() {
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedTariff, setSelectedTariff] = useState<Tariff | undefined>(undefined);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations('admin.tariff');

    useEffect(() => {
        const fetchTariffs = async () => {
            setIsLoading(true);
            try {
                const data = await getTariffs();
                setTariffs(data);
            } catch (err: any) {
                Logger.error("Error fetching tariffs", err);
                setError('Er is een fout opgetreden bij het ophalen van de tarieven.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTariffs().then();

        getCampaigns()
            .then(setCampaigns)
    }, []);

    const handleEditTariff = (tariffId: string) => {
        const tariff = tariffs.find((t) => t.id === tariffId);
        setIsNew(false);
        setSelectedTariff(tariff);
        setIsFormOpen(true);
    };

    const handleDeleteTariff = async (tariff: Tariff) => {
        const confirmDelete = window.confirm(t('confirmDeleteTariff'));
        if (!confirmDelete) return;

        try {
            await deleteTariff(tariff);
            setTariffs((prevTariffs) => prevTariffs.filter((t) => t.id !== tariff.id));
        } catch (err: any) {
            Logger.error("Error deleting tariff", err);
            setError('Er is een fout opgetreden bij het verwijderen van het tarief.');
        }
    };

    const handleSaveTariff = async (tariff: Tariff) => {
        await saveTariff(tariff);
        setTariffs((prev) => {
            const c = prev.find(c => c.id === tariff.id);
            return c ? prev.map((c) => (c.id === tariff.id ? tariff : c)) : [...prev, tariff];
        });
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setIsNew(true);
        setSelectedTariff(undefined);
    };

    if (isLoading) return <div>{t('loading')}</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="min-h-screen p-8 bg-cyan-950 text-white">
            <h1 className="text-2xl font-bold">{t('tariffManagement')}</h1>

            <div className="my-4">
                <button
                    onClick={() => {
                        setIsNew(true);
                        setSelectedTariff(undefined);
                        setIsFormOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    {t('addTariff')}
                </button>
            </div>

            <TariffTable
                tariffs={tariffs}
                onEdit={handleEditTariff}
                onDelete={handleDeleteTariff}
            />

            <Dialog
                visible={isFormOpen}
                onClose={handleCloseForm}
                title={selectedTariff ? t('editTariff') : t('addTariff')}
                closable={true}
                maskClosable={false}
                className="bg-cyan-900 text-white p-6 rounded shadow-md mx-auto w-auto max-w-5xl"
                footer={null}
            >
                {isFormOpen && (
                    <TariffForm
                        tariff={selectedTariff}
                        onSubmit={handleSaveTariff}
                        onClose={handleCloseForm}
                        isNew={isNew}
                        campaigns={campaigns}
                    />
                )}
            </Dialog>
        </div>
    );
}
