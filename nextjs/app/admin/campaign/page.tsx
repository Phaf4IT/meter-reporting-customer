'use client';

import {useState} from 'react';
import AdminLayout from '../adminlayout';
import {useTranslations} from "next-intl";

export default function CampaignsPage() {
    const t = useTranslations('admin.campaign'); // Gebruik de juiste namespace voor vertalingen
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        repeatValue: 1,
        repeatUnit: 'DAY',
        futureCampaignValue: '',
        futureCampaignUnit: 'YEAR',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/admin/campaigns', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            console.error(t('saveError')); // Vertaal de foutmelding
        } else {
            alert(t('saveSuccess')); // Vertaal het succesbericht
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t('pageTitle')}</h1>
                <form onSubmit={handleSubmit}
                      className="w-full max-w-lg bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                                   htmlFor="startDate">
                                {t('startDateLabel')}
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                required
                                value={formData.startDate}
                                onChange={(e) =>
                                    setFormData({...formData, startDate: e.target.value})
                                }
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                                   htmlFor="endDate">
                                {t('endDateLabel')}
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                required
                                value={formData.endDate}
                                onChange={(e) =>
                                    setFormData({...formData, endDate: e.target.value})
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                                   htmlFor="repeatValue">
                                {t('repeatLabel')}
                            </label>
                            <div className="flex space-x-4">
                                <input
                                    type="number"
                                    name="repeatValue"
                                    min="1"
                                    className="appearance-none block w-1/2 bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                    required
                                    value={formData.repeatValue}
                                    onChange={(e) =>
                                        setFormData({...formData, repeatValue: +e.target.value})
                                    }
                                />
                                <select
                                    name="repeatUnit"
                                    className="appearance-none block w-1/2 bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                    value={formData.repeatUnit}
                                    onChange={(e) =>
                                        setFormData({...formData, repeatUnit: e.target.value})
                                    }
                                >
                                    <option value="DAY">{t('day')}</option>
                                    <option value="MONTH">{t('month')}</option>
                                    <option value="YEAR">{t('year')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                                   htmlFor="futureCampaignValue">
                                {t('futureCampaignLabel')}
                            </label>
                            <div className="flex space-x-4">
                                <input
                                    type="number"
                                    name="futureCampaignValue"
                                    min="1"
                                    className="appearance-none block w-1/2 bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                    placeholder={t('optional')}
                                    value={formData.futureCampaignValue}
                                    onChange={(e) => setFormData({...formData, futureCampaignValue: e.target.value})}
                                />
                                <select
                                    name="futureCampaignUnit"
                                    className="appearance-none block w-1/2 bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                                    value={formData.futureCampaignUnit}
                                    onChange={(e) =>
                                        setFormData({...formData, futureCampaignUnit: e.target.value})
                                    }
                                >
                                    <option value="YEAR">{t('year')}</option>
                                    <option value="MONTH">{t('month')}</option>
                                    <option value="DAY">{t('day')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                    >
                        {t('saveButton')}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
