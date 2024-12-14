import React, {useState} from "react";
import {Campaign} from "@/app/admin/campaign/campaign";
import '@/components/dialog-styles.css';
import ConfirmationDialog from "@/components/admin/confirmation-dialog";

interface CampaignListProps {
    campaigns: Campaign[];
    t: (key: string) => string;
    onDelete: (campaign: Campaign) => void; 
}

const CampaignList = ({campaigns, t, onDelete}: CampaignListProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

    const openDialog = (campaign: Campaign) => {
        setCampaignToDelete(campaign);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setCampaignToDelete(null);
        setIsDialogOpen(false);
    };

    const handleDelete = () => {
        if (campaignToDelete) {
            onDelete(campaignToDelete);
        }
        closeDialog();
    };

    return (
        <div className="mb-6 bg-cyan-900 p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">{t('existingCampaigns')}</h2>
            {campaigns.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-cyan-950 text-white">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">{t('startDate')}</th>
                            <th className="px-4 py-2 text-left">{t('endDate')}</th>
                            <th className="px-4 py-2 text-left">{t('reminderDates')}</th>
                            <th className="px-4 py-2 text-left">{t('customerEmails')}</th>
                            <th className="px-4 py-2 text-left">{t('measureValues')}</th>
                            <th className="px-4 py-2 text-left">{t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {campaigns.map((campaign, index) => (
                            <tr
                                key={`${campaign.startDate}-${index}`}
                                className="border-b border-cyan-800 hover:bg-cyan-700"
                            >
                                <td className="px-4 py-2">{new Date(campaign.startDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{new Date(campaign.endDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2">
                                    <ul className="list-disc pl-5">
                                        {campaign.reminderDates.map((date, idx) => (
                                            <li key={idx}>
                                                {new Date(date).toLocaleDateString()} - {new Date(date).toLocaleTimeString()}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="max-h-32 overflow-y-auto pr-2">
                                        <ul className="list-disc pl-5">
                                            {campaign.customerEmails.map((email, idx) => (
                                                <li key={idx}>{email}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    {campaign.measureValues.map(value => value.name).join(', ')}
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => openDialog(campaign)}
                                    >
                                        {t('deleteButton')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-400">{t('noCampaigns')}</p>
            )}
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                onConfirm={handleDelete}
                title={t("deleteConfirmationTitle")}
                message={t("deleteConfirmationMessage")}
                confirmText={t("confirmDeleteButton")}
                cancelText={t("cancelButton")}
            />
        </div>
    );
};

export default CampaignList;
