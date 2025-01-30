import React, {useState} from "react";
import {Campaign} from "@/components/admin/campaign/campaign";
import '@/components/dialog-styles.css';
import ConfirmationDialog from "@/components/admin/confirmation-dialog";
import {CampaignConfiguration} from "@/components/admin/campaign-configuration/campaignConfiguration";
import {getTranslationForLocale} from "@/components/admin/entity-type/entityType";
import {useLocale} from "next-intl";

interface CampaignListProps {
    campaigns: Campaign[];
    campaignConfigurations: CampaignConfiguration[];
    t: (key: string) => string;
    onDelete: (campaign: Campaign) => void;
    openNewCampaign: (config: CampaignConfiguration) => void;
}

const CampaignList = ({campaigns, campaignConfigurations, t, onDelete, openNewCampaign}: CampaignListProps) => {
    const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
    const [showEntitiesPanel, setShowEntitiesPanel] = useState(false);
    const [showCustomersPanel, setShowCustomersPanel] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<CampaignConfiguration | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const locale = useLocale();

    const openDeleteConfirmationDialog = (campaign: Campaign) => {
        setCampaignToDelete(campaign);
        setIsDeleteConfirmationDialogOpen(true);
    };

    const closeDeleteConfirmationDialog = () => {
        setCampaignToDelete(null);
        setIsDeleteConfirmationDialogOpen(false);
    };

    const handleDelete = () => {
        if (campaignToDelete) {
            onDelete(campaignToDelete);
        }
        closeDeleteConfirmationDialog();
    };

    // Groeperen van campagnes per CampaignConfiguration
    const campaignsGroupedByConfig = campaignConfigurations.reduce((groups, config) => {
        groups[config.name] = campaigns.filter(campaign => campaign.configurationName === config.name);
        return groups;
    }, {} as Record<string, Campaign[]>);

    // Toggle de entities container
    const toggleEntitiesPanel = (config: CampaignConfiguration) => {
        setShowEntitiesPanel(prev => !prev);
        setSelectedConfig(config);
    };

    // Toggle de entities container
    const viewCustomers = (campaign: Campaign) => {
        setShowCustomersPanel(prev => !prev);
        setSelectedCampaign(campaign);
    };

    return (
        <div className="relative mb-6 bg-cyan-900 p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">{t('existingCampaigns')}</h2>
            {Object.keys(campaignsGroupedByConfig).length > 0 ? (
                Object.entries(campaignsGroupedByConfig).map(([configName, groupedCampaigns]) => {
                    const config = campaignConfigurations.find(cfg => cfg.name === configName)!;
                    return (
                        <div key={configName} className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-2">{t('campaignConfiguration')}: {configName}</h3>
                            {config && (
                                <div className="text-gray-400 mb-4">
                                    <p>{t('measureValues')}: {config.measureValues.map(mv => mv.name).join(', ')}</p>
                                    <button
                                        onClick={() => toggleEntitiesPanel(config)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                    >
                                        {showEntitiesPanel ? t('closeEntities') : t('openEntities')}
                                    </button>
                                </div>
                            )}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-cyan-950 text-white">
                                    <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">{t('campaignName')}</th>
                                        <th className="px-4 py-2 text-left">{t('type')}</th>
                                        <th className="px-4 py-2 text-left">{t('startDate')}</th>
                                        <th className="px-4 py-2 text-left">{t('endDate')}</th>
                                        <th className="px-4 py-2 text-left">{t('reminderDates')}</th>
                                        <th className="px-4 py-2 text-left">{t('customerEmails')}</th>
                                        <th className="px-4 py-2 text-left">{t('measureValues')}</th>
                                        <th className="px-4 py-2 text-left">{t('actions')}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {groupedCampaigns.map((campaign, index) => (
                                        <tr
                                            key={`${campaign.startDate}-${index}`}
                                            className="border-b border-cyan-800 hover:bg-cyan-700"
                                        >
                                            <td className="px-4 py-2">{campaign.name}</td>
                                            <td className="px-4 py-2">{campaign.type}</td>
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
                                                    {campaign.customers.length > 1 ? (<>
                                                        <button
                                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                            onClick={() => viewCustomers(campaign)}
                                                        >
                                                            {t('viewCustomers')}
                                                        </button>
                                                    </>) : (<>
                                                        {/* Klantinformatie */}
                                                        <p className="truncate">
                                <span
                                    className="font-semibold">{t('name')}:</span> {campaign.customers[0].title} {campaign.customers[0].firstName} {campaign.customers[0].middleName} {campaign.customers[0].lastName}
                                                        </p>
                                                        <p className="truncate">
                                                            <span
                                                                className="font-semibold">{t('email')}:</span> {campaign.customers[0].email}
                                                        </p>
                                                        <p className="truncate">
                                                            <span
                                                                className="font-semibold">{t('phoneNumber')}:</span> {campaign.customers[0].phoneNumber}
                                                        </p>

                                                        {/* Entiteit gerelateerde velden */}
                                                        {Object.keys(campaign.customers[0].entity?.entityType?.fields || []).map((fieldKey) => {
                                                            const fieldLabel = getTranslationForLocale(campaign.customers[0].entity!.entityType!, locale)[fieldKey] || fieldKey;
                                                            return (
                                                                <p key={fieldKey} className="truncate">
                                        <span
                                            className="font-semibold">{fieldLabel}:</span> {campaign.customers[0].entity!.fieldValues[fieldKey] || 'N/A'}
                                                                </p>
                                                            );
                                                        })}
                                                    </>)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                {config?.measureValues.map(mv => mv.name).join(', ')}
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                    onClick={() => openDeleteConfirmationDialog(campaign)}
                                                >
                                                    {t('deleteButton')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
                                    onClick={() => openNewCampaign(config)}
                                >
                                    {t('addCampaignButton')}
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-400">{t('noCampaigns')}</p>
            )}

            {showEntitiesPanel && selectedConfig && (
                <div
                    className="fixed right-0 top-0 h-full w-96 bg-cyan-800 p-4 overflow-y-auto shadow-lg transition-transform transform translate-x-0">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-semibold text-lg">{t('entitiesForConfig')}: {selectedConfig.name}</h3>
                        <button
                            onClick={() => setShowEntitiesPanel(false)}
                            className="text-white text-2xl font-bold hover:text-red-500"
                        >
                            &times;
                        </button>
                    </div>
                    {selectedConfig.entities.map((entity, idx) => (
                        <div key={idx} className="entity-card p-3 mb-4 bg-cyan-700 rounded shadow-md">
                            <h4 className="text-white font-semibold">{t('entity')} {idx + 1}</h4>
                            <div className="entity-details text-sm text-gray-300">
                                {Object.keys(entity.entityType?.fields || []).map((fieldKey) => {
                                    const fieldLabel = getTranslationForLocale(entity.entityType!, locale)[fieldKey] || fieldKey;
                                    return (
                                        <p key={fieldKey} className="truncate">
                                            <span
                                                className="font-semibold">{fieldLabel}:</span> {entity.fieldValues[fieldKey] || 'N/A'}
                                        </p>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => toggleEntitiesPanel(selectedConfig!)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mt-4"
                    >
                        {t('closePanel')}
                    </button>
                </div>
            )}

            {showCustomersPanel && selectedCampaign && (
                <div
                    className="fixed right-0 top-0 h-full w-96 bg-cyan-800 p-4 overflow-y-auto shadow-lg transition-transform transform translate-x-0">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-semibold text-lg">{t('entitiesForConfig')}: {selectedCampaign.name}</h3>
                        <button
                            onClick={() => setShowCustomersPanel(false)}
                            className="text-white text-2xl font-bold hover:text-red-500"
                        >
                            &times;
                        </button>
                    </div>
                    {selectedCampaign.customers.map((customer, idx) => (
                        <div key={idx} className="entity-card p-3 mb-4 bg-cyan-700 rounded shadow-md">
                            <h4 className="text-white font-semibold">{t('entity')} {idx + 1}</h4>
                            <div className="entity-details text-sm text-gray-300">
                                <p className="truncate">
                                <span
                                    className="font-semibold">{t('name')}:</span> {customer.title} {customer.firstName} {customer.middleName} {customer.lastName}
                                </p>
                                <p className="truncate">
                                    <span className="font-semibold">{t('email')}:</span> {customer.email}
                                </p>
                                <p className="truncate">
                                    <span className="font-semibold">{t('phoneNumber')}:</span> {customer.phoneNumber}
                                </p>
                                {Object.keys(customer.entity!.entityType?.fields || []).map((fieldKey) => {
                                    const fieldLabel = getTranslationForLocale(customer.entity!.entityType!, locale)[fieldKey] || fieldKey;
                                    return (
                                        <p key={fieldKey} className="truncate">
                                            <span
                                                className="font-semibold">{fieldLabel}:</span> {customer.entity!.fieldValues[fieldKey] || 'N/A'}
                                        </p>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => setShowCustomersPanel(false)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mt-4"
                    >
                        {t('closePanel')}
                    </button>
                </div>
            )}

            <ConfirmationDialog
                isOpen={isDeleteConfirmationDialogOpen}
                onClose={closeDeleteConfirmationDialog}
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
