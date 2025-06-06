'use client';
import React, {useEffect, useState} from 'react';
import {Reminder} from "@/components/admin/reminder/reminder";
import {getReminders} from "@/app/admin/reminder/client";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

export default function RemindersOverview() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const t = useTranslations('admin.reminder');

    useEffect(() => {
        getReminders().then(setReminders);
    }, []);

    return (
        <div
            className="w-full max-w-3xl bg-cyan-900 text-white p-6 rounded shadow-md space-y-4 max-h-[500px] overflow-y-auto">
            <h2 className="text-2xl font-bold">{t('remindersAdminTitle')}</h2>

            {reminders.length === 0 ? (
                <p>{t('noReminders')}</p>
            ) : (
                <div className="space-y-4">
                    {reminders.map((reminder, index) => (
                        <div
                            key={index}
                            className="bg-cyan-800 p-4 rounded-md shadow-md"
                        >
                            <div className="space-y-1">
                                <p className="text-lg font-semibold">{t('campaignName')}: {reminder.campaignName}</p>
                                <p>{t('reminderDate')}: {new Date(reminder.reminderDate).toLocaleString()}</p>
                                <Popover>
                                    <PopoverTrigger>Open om emailadressen te
                                        zien</PopoverTrigger>
                                    <PopoverContent className={'bg-cyan-800 text-white'}>
                                        <div className={'max-h-[500px] overflow-y-auto bg-cyan-800'}>
                                                {reminder.customerEmails.map((email, i) => (
                                                    <p key={i}>{email}</p>
                                                ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Link naar reminderbeheer */}
            <div className="pt-4 text-right">
                <Link
                    href="/admin/reminder"
                    className="text-sm text-cyan-200 hover:underline hover:text-white transition"
                >
                    Beheer reminders →
                </Link>
            </div>
        </div>
    );
}
