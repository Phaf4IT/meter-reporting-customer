"use client";
import React, {useEffect, useState} from "react";
import AdminLayout from "@/app/admin/adminlayout";
import {useTranslations} from "next-intl";
import {getCustomerMeasurements, saveCustomerMeasurement} from "@/app/admin/customer-measurement/client";
import CustomerMeasurementForm from "@/components/admin/customer-measurement/customer-measurement-form";
import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";

export default function CustomerMeasurementsPage() {
    const t = useTranslations("admin.customerMeasurement");
    const [customerMeasurements, setCustomerMeasurements] = useState<CustomerMeasurement[]>([]);
    const [editingCustomerMeasurement, setEditingCustomerMeasurement] = useState<CustomerMeasurement | null>(null);
    const [isOverruling, setIsOverruling] = useState(false);  // Voeg toe om te controleren of we aan het overschrijven zijn

    useEffect(() => {
        // Haal de customer measurements op
        getCustomerMeasurements().then((measurements) => {
            setCustomerMeasurements(measurements);
        });
    }, []);

    const handleSave = async (customerMeasurement: CustomerMeasurement, isNew: boolean) => {
        // Als we overschrijven, markeer dan de actie als overschrijven en sla op
        saveCustomerMeasurement(customerMeasurement, !isNew).then((savedMeasurement) => {
            setCustomerMeasurements((prev) => {
                const existing = prev.find(
                    (m) => m.customerMail === savedMeasurement.customerMail && m.campaignName === savedMeasurement.campaignName
                );
                return existing
                    ? prev.map((m) => (m.customerMail === savedMeasurement.customerMail && m.campaignName === savedMeasurement.campaignName ? savedMeasurement : m))
                    : [...prev, savedMeasurement];
            });
            setEditingCustomerMeasurement(null);  // Sluit het formulier af na opslaan
            setIsOverruling(false);  // Reset overschrijvingsflag
        });
    };

    const openEditor = (customerMeasurement: CustomerMeasurement, isOverruling: boolean = false) => {
        setEditingCustomerMeasurement(customerMeasurement);  // Zet de meting die je wilt bewerken of overschrijven
        setIsOverruling(isOverruling);  // Als we overschrijven, markeer dan de actie
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t('manageCustomerMeasurements')}</h1>
                {editingCustomerMeasurement ? (
                    <CustomerMeasurementForm
                        customerMeasurement={editingCustomerMeasurement}
                        isOverruling={isOverruling}  // Geef de overschrijfstatus door naar het formulier
                        onSave={(customerMeasurement) => handleSave(customerMeasurement, !isOverruling)}  // Bij opslaan, bepaal of het een nieuwe meting is of overschrijven
                        onCancel={() => setEditingCustomerMeasurement(null)}  // Annuleer bewerken/overschrijven
                    />
                ) : (
                    <>
                        <table className="table-auto w-full border-collapse bg-cyan-900 text-white rounded shadow-lg">
                            <thead>
                            <tr className="border-b border-cyan-700">
                                <th className="py-2 px-4 text-left">{t("customerMail")}</th>
                                <th className="py-2 px-4 text-left">{t("campaignName")}</th>
                                <th className="py-2 px-4 text-left">{t("measurements")}</th>
                                <th className="py-2 px-4 text-left">{t("actions")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customerMeasurements.map((measurement) => (
                                <tr key={`${measurement.customerMail}-${measurement.campaignName}`}
                                    className="border-b border-cyan-700">
                                    <td className="py-2 px-4">{measurement.customerMail}</td>
                                    <td className="py-2 px-4">{measurement.campaignName}</td>
                                    <td className="py-2 px-4">
                                        {measurement.measurements.map((m) => (
                                            <div key={m.name}>
                                                <strong>{m.name}:</strong> {m.value}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => openEditor(measurement)}  // "Bewerken"
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            {t("edit")}
                                        </button>
                                        <button
                                            onClick={() => openEditor(measurement, true)}  // "Overschrijven"
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            {t("overrule")}
                                        </button>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
