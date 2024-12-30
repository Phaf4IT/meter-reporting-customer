import React, {useEffect, useState} from 'react';

interface CampaignNameFormProps {
    t: (key: string) => string;
    campaignName: string | undefined;
    setCampaignName: (name: string) => void;
    currentCampaignNames: string[];
}

const CampaignNameForm = ({
                              t,
                              campaignName,
                              setCampaignName,
                              currentCampaignNames,
                          }: CampaignNameFormProps) => {

    const [error, setError] = useState<string>('');

    useEffect(() => {

        if (currentCampaignNames.includes(campaignName || '')) {
            setError(t('campaignNameExists'));
        } else {
            setError('');
        }
    }, [campaignName, currentCampaignNames, t]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setCampaignName(newName);

        if (currentCampaignNames.includes(newName)) {
            setError(t('campaignNameExists'));
        } else {
            setError('');
        }
    };

    return (
        <div
            className="w-full max-w-lg bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
            <div className="flex flex-col space-y-4">
                <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2">
                    {t('enterCampaignName')}
                </label>
                <input
                    type="text"
                    value={campaignName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    required
                />
                {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignNameForm;
