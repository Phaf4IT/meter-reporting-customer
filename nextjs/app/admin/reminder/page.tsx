"use client"
import React, {useEffect, useState} from 'react';
import {Reminder} from "@/components/admin/reminder/reminder";
import {useTranslations} from "next-intl";
import {deleteReminder, getReminders, sendReminder} from "@/app/admin/reminder/client";

const ReminderPage = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const t = useTranslations('admin.reminder');  // Gebruik de namespace 'admin.meter'

    useEffect(() => {
        const fetchReminders = async () => {
            getReminders()
                .then(reminders => setReminders(reminders))
        };

        fetchReminders();
    }, []);

    const removeReminder = (reminder: Reminder) => {
        deleteReminder(reminder)
            .then(() => setReminders(reminders.filter(r => r !== reminder)));
    };

    const sendReminderNow = (reminder: Reminder) => {
        sendReminder(reminder)
            .then(() => setReminders(reminders.filter(r => r !== reminder)));
    };

    return (
        <div className="bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
            <h2 className="text-xl font-bold">{t('remindersAdminTitle')}</h2>
            {reminders.length === 0 ? (
                <p>{t('noReminders')}</p>
            ) : (
                <div className="space-y-4">
                    {reminders.map((reminder, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center bg-cyan-800 p-4 rounded-md shadow-md"
                        >
                            <div className="flex flex-col">
                                <span className="text-lg">{t('campaignName')}: {reminder.campaignName}</span>
                                <span>{t('reminderDate')}: {reminder.reminderDate.toLocaleString()}</span>
                                <div className="mt-2">
                                    <span className="font-semibold">{t('emailAddresses')}:</span>
                                    <ul>
                                        {reminder.customerEmails.map((email, i) => (
                                            <li key={i}>{email}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                {/* Send Reminder Now */}
                                <button
                                    onClick={() => sendReminderNow(reminder)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    {t('sendNow')}
                                </button>

                                {/* Remove Reminder */}
                                <button
                                    onClick={() => removeReminder(reminder)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {t('removeReminder')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReminderPage;
