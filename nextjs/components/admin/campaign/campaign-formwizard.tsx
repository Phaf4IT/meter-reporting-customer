import React, {useEffect, useState} from 'react';
import {Customer} from "@/components/admin/customer/customer";
import {getCustomers} from "@/app/admin/customer/client";
import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import DateRangePicker from "@/components/admin/campaign/date-range-picker";
import MeasureValuesSelector from "@/components/admin/campaign/measure-values";
import ReminderDates from "@/components/admin/campaign/reminder-dates";
import CustomerSelection from "@/components/admin/campaign/customer-selection";
import {Campaign} from "@/components/admin/campaign/campaign";
import FormWizard from "@/components/admin/form-wizard";
import {getMeasureValues} from "@/app/admin/measure-value/client";
import CampaignNameForm from "@/components/admin/campaign/campaign-name-form";
import {ModifiableCampaign} from "@/app/api/admin/campaign/route";

interface CampaignFormWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (campaign: Campaign) => Promise<void>;
    t: (key: string) => string;
    currentCampaignNames: string[];
}

const CampaignFormWizard: React.FC<CampaignFormWizardProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onSubmit,
                                                                   t,
                                                                   currentCampaignNames
                                                               }: any) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedMeasures, setSelectedMeasures] = useState<MeasureValue[]>([]);
    const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
    const [reminderDates, setReminderDates] = useState<Date[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [name, setName] = useState<string>('');
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [measureValues, setMeasureValues] = useState<MeasureValue[]>([]);

    useEffect(() => {
        if (isOpen) {
            getMeasureValues()
                .then(values => {
                    setMeasureValues(values)
                    setSelectedMeasures(values)
                })
            getCustomers()
                .then(customers => {
                    setCustomers(customers);
                    setSelectedCustomers(customers.map((c: Customer) => c));
                });
        }
    }, [isOpen]);

    const handleFormSubmit = () => {
        const campaignData: ModifiableCampaign = {
            name: name,
            startDate: startDate!,
            endDate: endDate!,
            reminderDates: reminderDates,
            customerIds: selectedCustomers.map(c => c.id),
            measureValues: selectedMeasures
        };
        return onSubmit(campaignData)
            .then(() => {
                setName('')
                setStartDate(undefined);
                setEndDate(undefined);
                setReminderDates([]);
                setSelectedCustomers([]);
            });
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
            title: t('dateRangeTitle'),
            content: (
                <DateRangePicker
                    t={t}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={(date: Date) => setStartDate(date)}
                    setEndDate={(date: Date) => setEndDate(date)}
                />
            ),
            onValidate: () => !!(startDate && endDate),
        },
        {
            title: t('measureValuesTitle'),
            content: (
                <MeasureValuesSelector
                    t={t}
                    measureValues={measureValues}
                    selectedMeasures={selectedMeasures}
                    setSelectedMeasures={setSelectedMeasures}
                    setMeasureValues={setMeasureValues}
                />
            ),
        },
        {
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
        },
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
