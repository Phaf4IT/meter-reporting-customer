"use client";
import React, {useEffect, useState} from "react";
import AdminLayout from "@/app/admin/adminlayout";
import {useTranslations} from "next-intl";
import {
    getCustomerMeasurements,
    getRemindersSent,
    saveCustomerMeasurement
} from "@/app/admin/customer-measurement/client";
import {getCampaigns} from "@/app/admin/campaign/client"; // Veronderstelde API om campagnes op te halen
import CustomerMeasurementForm from "@/components/admin/customer-measurement/customer-measurement-form";
import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";
import {Campaign} from "@/components/admin/campaign/campaign";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";

export default function CustomerMeasurementsPage() {
    const t = useTranslations("admin.customerMeasurement");
    const [customerMeasurements, setCustomerMeasurements] = useState<CustomerMeasurement[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [reminders, setReminders] = useState<ReminderSent[]>([]);
    const [editingCustomerMeasurement, setEditingCustomerMeasurement] = useState<CustomerMeasurement | null>(null);
    const [isOverruling, setIsOverruling] = useState(false);

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
        saveCustomerMeasurement(customerMeasurement, !isNew).then((savedMeasurement) => {
            setCustomerMeasurements((prev) => {
                const existing = prev.find(
                    (m) => m.customerMail === savedMeasurement.customerMail && m.campaignName === savedMeasurement.campaignName
                );
                return existing
                    ? prev.map((m) => (m.customerMail === savedMeasurement.customerMail && m.campaignName === savedMeasurement.campaignName ? savedMeasurement : m))
                    : [...prev, savedMeasurement];
            });
            setEditingCustomerMeasurement(null);
            setIsOverruling(false);
        });
    };

    const openEditor = (customerMeasurement: CustomerMeasurement, isOverruling: boolean = false) => {
        setEditingCustomerMeasurement(customerMeasurement);
        setIsOverruling(isOverruling);
    };

    const getMeasurementForCustomer = (campaignName: string, customerEmail: string): CustomerMeasurement | null => {
        return customerMeasurements.find(
            (measurement) => measurement.campaignName === campaignName && measurement.customerMail === customerEmail
        ) || null;
    };

    const hasReminderBeenSent = (campaignName: string, customerEmail: string): boolean => {
        return reminders.some(
            (reminder) => reminder.campaignName === campaignName && reminder.customerEmail === customerEmail
        );
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t("manageCustomerMeasurements")}</h1>
                {editingCustomerMeasurement ? (
                    <CustomerMeasurementForm
                        customerMeasurement={editingCustomerMeasurement}
                        isOverruling={isOverruling}
                        onSave={(customerMeasurement) => handleSave(customerMeasurement, !isOverruling)}
                        onCancel={() => setEditingCustomerMeasurement(null)}
                    />
                ) : (
                    <>
                        {campaigns.map((campaign) => (
                            <div key={campaign.name} className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">{campaign.name}</h2>
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
                                    {campaign.customerEmails.map((customerEmail) => {
                                        const measurement = getMeasurementForCustomer(campaign.name, customerEmail);
                                        const reminderSent = hasReminderBeenSent(campaign.name, customerEmail);
                                        return (
                                            <tr key={customerEmail} className="border-b border-cyan-700">
                                                <td className="py-2 px-4">{customerEmail}</td>
                                                <td className="py-2 px-4">
                                                    {measurement ? (
                                                        <>
                                                            {measurement.measurements.map((m) => (
                                                                <div key={m.name}>
                                                                    <strong>{m.name}:</strong> {m.value}
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
                                                        // Overschrijven alleen als er metingen zijn
                                                        <button
                                                            onClick={() => openEditor(measurement, true)}
                                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                        >
                                                            {t("overrule")}
                                                        </button>
                                                    ) : (
                                                        // Als er geen meting is, kan de admin zelf invoeren
                                                        <button
                                                            onClick={() =>
                                                                openEditor(
                                                                    {
                                                                        campaignName: campaign.name,
                                                                        customerMail: customerEmail,
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
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
