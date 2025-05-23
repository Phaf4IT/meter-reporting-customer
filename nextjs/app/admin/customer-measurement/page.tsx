"use client";
import React, {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {
    getCustomerMeasurements,
    getRemindersSent,
    saveCustomerMeasurement
} from "@/app/admin/customer-measurement/client";
import {getCampaigns} from "@/app/admin/campaign/client";
import CustomerMeasurementForm, {
    CustomerMeasurementCampaign
} from "@/components/admin/customer-measurement/customer-measurement-form";
import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";
import {Campaign} from "@/components/admin/campaign/campaign";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";
import Dialog from "rc-dialog";
import 'rc-dialog/assets/index.css';
import '@/components/dialog-styles.css';
import Image from "next/image";

export default function CustomerMeasurementsPage() {
    const t = useTranslations("admin.customerMeasurement");
    const [customerMeasurements, setCustomerMeasurements] = useState<CustomerMeasurement[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [reminders, setReminders] = useState<ReminderSent[]>([]);
    const [editingCustomerMeasurement, setEditingCustomerMeasurement] = useState<CustomerMeasurementCampaign>();
    const [isOverruling, setIsOverruling] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        Promise.all([
            getCustomerMeasurements(),
            getCampaigns(),
            getRemindersSent(),
        ]).then(([measurements, campaigns, reminders]) => {
            setCustomerMeasurements(measurements);
            setCampaigns(campaigns);
            setReminders(reminders);
        });
    }, []);

    const handleSave = async (customerMeasurement: CustomerMeasurement, isNew: boolean) => {
        saveCustomerMeasurement(customerMeasurement, isNew).then((savedMeasurement) => {
            setCustomerMeasurements((prev) => {
                const existing = prev.find(
                    (m) => m.customerId === savedMeasurement.customerId && m.campaignName === savedMeasurement.campaignName
                );
                return existing
                    ? prev.map((m) => (m.customerId === savedMeasurement.customerId && m.campaignName === savedMeasurement.campaignName ? savedMeasurement : m))
                    : [...prev, savedMeasurement];
            });
            closeEditor();
        });
    };

    const openEditor = (campaign: Campaign, customerMeasurement: CustomerMeasurement, isOverruling: boolean = false) => {
        const customerCampaign: CustomerMeasurementCampaign = {customerMeasurement, campaign}
        setEditingCustomerMeasurement(customerCampaign);
        setIsOverruling(isOverruling);
        setIsDialogOpen(true);
    };

    const closeEditor = () => {
        setEditingCustomerMeasurement(undefined);
        setIsOverruling(false);
        setIsDialogOpen(false);
    }

    const getMeasurementForCustomer = (campaignName: string, customerId: string): CustomerMeasurement | null => {
        return customerMeasurements.find(
            (measurement) => measurement.campaignName === campaignName && measurement.customerId === customerId
        ) || null;
    };

    const hasReminderBeenSent = (campaignName: string, customerEmail: string): boolean => {
        return reminders.some(
            (reminder) => reminder.campaignName === campaignName && reminder.customerEmail === customerEmail
        );
    };

    return (
        <div className="min-h-screen p-8 bg-cyan-950 text-white">
            <h1 className="text-2xl font-bold mb-6">{t("manageCustomerMeasurements")}</h1>
            <Dialog
                visible={isDialogOpen}
                onClose={closeEditor}
                title={t('enterMeasurement')}
                closable={true}
                maskClosable={false}
                className="bg-cyan-900 text-white p-6 rounded shadow-md max-w-lg mx-auto"
                footer={null}
            >
                {editingCustomerMeasurement && (
                    <CustomerMeasurementForm
                        customerMeasurementCampaign={editingCustomerMeasurement}
                        isOverruling={isOverruling}
                        onSave={(customerMeasurement) => handleSave(customerMeasurement, !isOverruling)}
                        onCancel={closeEditor}
                    />
                )}
            </Dialog>
            {campaigns.map((campaign) => (
                <div key={campaign.name} className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">{campaign.name}</h2>
                    <a
                        href={`/api/admin/export/measurements/?campaign=${encodeURIComponent(campaign.name)}`}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded my-2"
                    >
                        📥 Exporteer csv
                    </a>
                    <table
                        className="table-auto w-full border-collapse bg-cyan-900 text-white rounded shadow-lg">
                        <thead>
                        <tr className="border-b border-cyan-700">
                            <th className="py-2 px-4 text-left">{t("customerMail")}</th>
                            <th className="py-2 px-4 text-left">{t("measurements")}</th>
                            <th className="py-2 px-4 text-left">{t("reminderSent")}</th>
                            <th className="py-2 px-4 text-left">{t("actions")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {campaign.customers.map((customer) => {
                            const measurement = getMeasurementForCustomer(campaign.name, customer.id);
                            const reminderSent = hasReminderBeenSent(campaign.name, customer.email);
                            return (
                                <tr key={customer.id} className="border-b border-cyan-700">
                                    <td className="py-2 px-4">{customer.email}</td>
                                    <td className="py-2 px-4">
                                        {measurement ? (
                                            <>
                                                {measurement.measurements.map((m) => (
                                                    <div key={m.name}>
                                                        <strong>{m.name}:</strong> {
                                                        campaign.measureValues.find(value => value.name === m.name)?.type === 'PHOTO_UPLOAD' && m.value ?
                                                            (<Image src={m.value}
                                                                    alt={m.name}
                                                                    width="0"
                                                                    height="0"
                                                                    sizes="100vw"
                                                                    className="w-32 h-auto transform transition-transform duration-300 ease-in-out hover:scale-150 hover:z-10"
                                                            />) : m.value
                                                    }
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <span>{t("measurementPending")}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {reminderSent ? t("reminderSent") : t("reminderNotSent")}
                                    </td>
                                    <td className="py-2 px-4 space-x-2">
                                        {measurement ? (

                                            <button
                                                onClick={() => openEditor(campaign, measurement, true)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                {t("overrule")}
                                            </button>
                                        ) : (

                                            <button
                                                onClick={() =>
                                                    openEditor(
                                                        campaign,
                                                        {
                                                            campaignName: campaign.name,
                                                            customerId: customer.id,
                                                            customerMail: customer.email,
                                                            measurements: [],
                                                            dateTime: new Date(),
                                                        },
                                                        false
                                                    )
                                                }
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                            >
                                                {t("enterMeasurement")}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
