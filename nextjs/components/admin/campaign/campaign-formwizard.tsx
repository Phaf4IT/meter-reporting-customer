import React, {useEffect, useState} from 'react';
import {Customer} from "@/app/admin/customer/customer";
import {getCustomers} from "@/app/admin/customer/client";
import {MeasureValue} from "@/app/admin/measure-value/measureValue";
import DateRangePicker from "@/components/admin/campaign/date-range-picker";
import MeasureValuesSelector from "@/components/admin/campaign/measure-values";
import ReminderDates from "@/components/admin/campaign/reminder-dates";
import CustomerSelection from "@/components/admin/campaign/customer-selection";
import {Campaign} from "@/app/admin/campaign/campaign";
import FormWizard from "@/components/admin/form-wizard";
import {getMeasureValues} from "@/app/admin/measure-value/client";

interface CampaignFormWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (campaign: Campaign) => Promise<void>;
    t: (key: string) => string;
}

const CampaignFormWizard: React.FC<CampaignFormWizardProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onSubmit,
                                                                   t
                                                               }: any) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedMeasures, setSelectedMeasures] = useState<MeasureValue[]>([]);
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [reminderDates, setReminderDates] = useState<Date[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
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
                    setSelectedCustomers(customers.map((c: Customer) => c.email));
                });
        }
    }, [isOpen]);

    const handleFormSubmit = () => {
        const campaignData = new Campaign(selectedCustomers, endDate!, selectedMeasures, reminderDates, startDate!);
        return onSubmit(campaignData)
            .then(() => {
                setStartDate(undefined);
                setEndDate(undefined);
                setReminderDates([]);
                setSelectedCustomers([]);
            });
    };

    const steps = [
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
