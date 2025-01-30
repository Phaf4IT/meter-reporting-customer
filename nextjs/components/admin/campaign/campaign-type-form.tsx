import React, {useEffect, useState} from 'react';
import {Campaign, CampaignType} from "@/components/admin/campaign/campaign";
import {useTranslations} from "next-intl";

interface CampaignTypeFormProps {
    campaignType: CampaignType | undefined;
    currentCampaigns: Campaign[];
    setCampaignType: (type: CampaignType) => void;
}

const CampaignTypeForm = ({
                              campaignType,
                              currentCampaigns,
                              setCampaignType,
                          }: CampaignTypeFormProps) => {
    const [error, setError] = useState<string>('');
    const t = useTranslations('admin.campaign');

    useEffect(() => {
        if (!campaignType) {
            setError(t('invalidCampaignType'));
        } else {
            setError('');
        }
    }, [campaignType, t]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as CampaignType;
        setCampaignType(newType);
    };

    return (
        <div className="w-full max-w-lg bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
            <div className="flex flex-col space-y-4">
                <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2">
                    {t('selectCampaignType')}
                </label>
                <select
                    value={campaignType || ''}
                    onChange={handleSelectChange}
                    className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    required
                >
                    <option value="">{t('selectCampaignType')}</option>
                    {(currentCampaigns && currentCampaigns.length > 0) ?
                        Object.keys(CampaignType)
                            .filter((v) => isNaN(Number(v)))
                            .map((key) => (
                                <option key={key} value={key}>
                                    {t(`campaignType.${key}`)}
                                </option>
                            )) : (<option key={CampaignType.BASE} value={CampaignType.BASE}>
                            {t(`campaignType.${CampaignType.BASE}`)}
                        </option>)}
                </select>

                {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignTypeForm;
