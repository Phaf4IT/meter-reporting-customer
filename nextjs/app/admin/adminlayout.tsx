'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import {FiChevronDown} from 'react-icons/fi'; // Import iconen
import "./../globals.css";
import {useLocale, useTranslations} from "next-intl";
import LanguageSwitcher from "@/app/languageswitcher";
import {EntityType} from "@/components/admin/entity-type/entityType";
import {getEntityTypes} from "@/app/admin/entity-type/client";
import {Logger} from '@/lib/logger';

export default function AdminLayout({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const t = useTranslations('admin');
    const [entityTypes, setEntityTypes] = useState<EntityType[]>([]);
    const locale = useLocale();
    const languageCode = locale.split('-')[0];

    useEffect(() => {
        getEntityTypes()
            .then(setEntityTypes)
            .catch((error) => Logger.error("Fout bij ophalen entity types", error));

    }, []);

    const [isDropdownOpen, setDropdownOpen] = useState(true);  // Standaard uitgeklapt
    const navItems = [
        {name: t('entity-type.entityTypeManagement'), href: '/admin/entity-type'},
        {name: t('customer.manageCustomers'), href: '/admin/customer'},
        {name: t('campaign.pageTitle'), href: '/admin/campaign'},
        {name: t('measureValue.manageMeasureValues'), href: '/admin/measure-value'},
        {name: t('reminder.remindersAdminTitle'), href: '/admin/reminder'},
        {name: t('meter.pageTitle'), href: '/admin/customer-measurement'},
        {name: 'Tarieven', href: '/admin/tariff'},
    ];

    return (
        <div className="flex min-h-screen bg-cyan-950 text-white">
            <nav className="w-64 bg-cyan-900 p-6">
                <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
                <ul className="space-y-4">
                    <li><LanguageSwitcher/></li>

                    {entityTypes.length > 1 &&
                        <li>
                            <div
                                className="px-4 py-2 cursor-pointer flex justify-between items-center"
                                onClick={() => setDropdownOpen(!isDropdownOpen)} // Toggle dropdown
                            >
                                <span>Entiteiten</span>
                                <span
                                    className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                >
                             <FiChevronDown/>
                            </span>
                            </div>

                            <ul
                                className={`space-y-2 pl-4 overflow-hidden transition-all duration-300 ease-in-out ${
                                    isDropdownOpen ? 'max-h-[500px]' : 'max-h-0'
                                }`}
                            >
                                {entityTypes.map((item) => <li key={item.name}>
                                    <Link
                                        href={`/admin/entity/${item.name}`}
                                        className="block px-4 py-2 rounded hover:bg-cyan-800"
                                    >
                                        {
                                            Object.entries(item.translations)
                                                .filter(([key]) => key.startsWith(languageCode))
                                                .map(([, value]) => value ? value[item.name] : item.name)
                                                .find(() => true) || item.name
                                        }
                                    </Link>
                                </li>)}
                            </ul>
                        </li>
                    }
                    {entityTypes.length == 1 &&
                        <li>
                            <Link
                                href={`/admin/entity/${entityTypes[0].name}`}
                                className="block px-4 py-2 rounded hover:bg-cyan-800"
                            >
                                {
                                    Object.entries(entityTypes[0].translations)
                                        .filter(([key]) => key.startsWith(languageCode))
                                        .map(([, value]) => value ? value[entityTypes[0].name] : entityTypes[0].name)
                                        .find(() => true) || entityTypes[0].name
                                }
                            </Link>
                        </li>
                    }

                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`block px-4 py-2 rounded ${
                                    pathname === item.href
                                        ? 'bg-cyan-700'
                                        : 'hover:bg-cyan-800'
                                }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
