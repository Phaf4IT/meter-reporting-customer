import React, {useEffect, useState} from 'react';
import {Customer} from "@/components/admin/customer/customer";
import {getCustomersByEntityIds} from "@/app/admin/customer/client";
import DateRangePicker from "@/components/admin/campaign/date-range-picker";
import ReminderDates from "@/components/admin/campaign/reminder-dates";
import CustomerSelection from "@/components/admin/campaign/customer-selection";
import FormWizard from "@/components/admin/form-wizard";
import CampaignNameForm from "@/components/admin/campaign/campaign-name-form";
import {ModifiableCampaign} from "@/app/api/admin/campaign/route";
import {CampaignConfiguration} from "@/components/admin/campaign-configuration/campaignConfiguration";
import CampaignTypeForm from "@/components/admin/campaign/campaign-type-form";
import {Campaign, CampaignType} from "@/components/admin/campaign/campaign";

interface CampaignFormWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (campaign: ModifiableCampaign) => Promise<void>;
    t: (key: string) => string;
    currentCampaignNames: string[];
    currentCampaigns: Campaign[];
    selectedCampaignConfiguration?: CampaignConfiguration;
}

const CampaignFormWizard: React.FC<CampaignFormWizardProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onSubmit,
                                                                   currentCampaigns,
                                                                   t,
                                                                   currentCampaignNames,
                                                                   selectedCampaignConfiguration
                                                               }: CampaignFormWizardProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
    const [reminderDates, setReminderDates] = useState<Date[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [name, setName] = useState<string>('');
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [campaignType, setCampaignType] = useState<CampaignType | undefined>(undefined);

    useEffect(() => {
        if (isOpen && selectedCampaignConfiguration) {
            getCustomersByEntityIds(selectedCampaignConfiguration.entities.map(value => value.id!))
                .then(customers => {
                    setCustomers(customers);
                    setSelectedCustomers(customers.map((c: Customer) => c));
                });
        }
    }, [isOpen, selectedCampaignConfiguration, selectedCampaignConfiguration?.entities, selectedCampaignConfiguration?.measureValues]);

    const handleFormSubmit = async () => {
        const campaignData: ModifiableCampaign = {
            name: name,
            startDate: startDate!,
            endDate: endDate!,
            reminderDates: reminderDates,
            customerIds: selectedCustomers.map(c => c.id),
            measureValues: selectedCampaignConfiguration!.measureValues,
            configurationName: selectedCampaignConfiguration!.name,
            type: campaignType!
        };
        await onSubmit(campaignData);
        setName('');
        setStartDate(undefined);
        setEndDate(undefined);
        setReminderDates([]);
        setSelectedCustomers([]);
        setCampaignType(undefined);
    };

    const steps = [
        {
            title: t('campaignName'),
            content: (
                <CampaignNameForm
                    t={t}
                    campaignName={name}
                    setCampaignName={(name: string) => setName(name)}
                    currentCampaignNames={currentCampaignNames}
                />
            )
        },
        {

            title: 'Type',
            content: (<CampaignTypeForm
                campaignType={campaignType}
                setCampaignType={setCampaignType}
                currentCampaigns={currentCampaigns}
            />),
            onValidate: () => true
        },
        {
            title: t('dateRangeTitle'),
            content: (
                <DateRangePicker
                    t={t}
                    startDate={startDate}
                    endDate={endDate}
                    minDate={
                    // campaignType !== 'BASE' ? new Date() :
                        undefined
                }
                    setStartDate={(date: Date) => setStartDate(date)}
                    setEndDate={(date: Date) => setEndDate(date)}
                />
            ),
            onValidate: () => !!(startDate && endDate),
        },
        // Conditionally render this step based on campaignType
        ...(campaignType !== 'BASE' ? [{
            title: t('reminderDatesTitle'),
            content: (
                <ReminderDates
                    t={t}
                    startDate={startDate}
                    endDate={endDate}
                    reminderDates={reminderDates}
                    setReminderDates={setReminderDates}
                />
            ),
            onValidate: () => true
        }] : []), // Empty array to exclude this step if BASE
        {
            title: t('customerSelectionTitle'),
            content: (
                <CustomerSelection
                    t={t}
                    customers={customers}
                    selectedCustomers={selectedCustomers}
                    setSelectedCustomers={setSelectedCustomers}
                />
            ),
            onValidate: () => selectedCustomers && selectedCustomers.length > 0,
        },
    ];

    return (
        <FormWizard
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleFormSubmit}
            steps={steps}
            t={t}
        />
    );
};

export default CampaignFormWizard;
