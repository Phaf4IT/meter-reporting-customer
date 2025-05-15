'use client';

import {useEffect, useState} from 'react';
import {getCustomers} from '@/app/admin/customer/client';
import CustomerImport from "@/components/admin/customer/import";
import {Customer} from "@/components/admin/customer/customer";
import RemindersOverview from "@/components/admin/reminder/reminder-overview";

export default function AdminDashboard() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCustomers()
            .then((data) => {
                setCustomers(data);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-white p-4">Laden...</div>;
    }

    return (
        <div className="min-h-screen mt-10 flex flex-wrap gap-5">
            {customers.length > 0 ? (
                <div className="w-full max-w-3xl bg-cyan-900 p-6 rounded shadow-md space-y-4 max-h-[500px]">
                    <h2 className="text-2xl font-bold">Klantenoverzicht</h2>
                    <ul className="space-y-2">
                        {customers.map((customer) => (
                            <li
                                key={customer.id}
                                className="bg-cyan-800 px-4 py-3 rounded-md flex justify-between items-center"
                            >
                                <span>{customer.firstName} {customer.lastName}</span>
                                <span className="text-sm text-cyan-300">{customer.email}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <CustomerImport onSuccess={async () => {
                    const updated = await getCustomers();
                    setCustomers(updated);
                }}/>
            )}

            <RemindersOverview/>

        </div>
    );
}
