'use client';

import {useEffect, useState} from 'react';
import {Meter} from "@/app/admin/meter/meter";
import AdminLayout from '../adminlayout';
import {useTranslations} from 'next-intl';
import {getMeters} from "@/app/admin/meter/client";

export default function MetersPage() {
    const [meters, setMeters] = useState<Meter[]>([]);
    const t = useTranslations('admin.meter');  // Gebruik de namespace 'admin.meter'

    useEffect(() => {
        getMeters()
            .then(meters => setMeters(meters));
    }, []);

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t('pageTitle')}</h1>
                {meters.length === 0 ? (
                    <p className="text-center text-gray-300">{t('noMetersFound')}</p>
                ) : (
                    <table className="table-auto w-full border-collapse bg-cyan-900 text-white rounded shadow-lg">
                        <thead>
                        <tr className="border-b border-cyan-700">
                            <th className="py-2 px-4 text-left">{t('customer')}</th>
                            <th className="py-2 px-4 text-left">{t('gas')}</th>
                            <th className="py-2 px-4 text-left">{t('water')}</th>
                            <th className="py-2 px-4 text-left">{t('light')}</th>
                            <th className="py-2 px-4 text-left">{t('date')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {meters.map((meter) => (
                            <tr key={meter.id} className="border-b border-cyan-700">
                                <td className="py-2 px-4">{meter.customerEmail}</td>
                                <td className="py-2 px-4">{meter.gas}</td>
                                <td className="py-2 px-4">{meter.water}</td>
                                <td className="py-2 px-4">{meter.light}</td>
                                <td className="py-2 px-4">{meter.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>)}
            </div>
        </AdminLayout>
    );
}
