'use server';
import Link from 'next/link';
import './../globals.css';
import {checkPermission, Permission} from '@/components/authjs/rbac';
import {EntityType} from "@/components/admin/entity-type/entityType";
import {getLocale, getTranslations} from "next-intl/server";
import Dropdown from "@/app/admin/dropdown";
import {auth} from "@/auth";
import {getEntityTypes} from "@/components/admin/entity-type/action/getEntityTypesAction";
import {headers} from "next/headers";
import {ToastingProvider} from "@/app/admin/toaster";
import LanguageSwitcher from "@/app/languageswitcher";
import {SignOut} from "@/app/admin/signout";

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const session = await auth() // Haal de sessie op
    const entityTypes: EntityType[] = await getEntityTypes(session!.user!.company!);

    const locale = await getLocale(); // Of kies een fallback taal
    const languageCode = locale.split('-')[0]; // Gebruik alleen de taalcode
    const heads = await headers()
    const pathname = heads.get('next-url')

    const t = await getTranslations('admin'); // Gebruik vertalingen

    const navItems: { name: string, href: string, permission_level: Permission }[] = [
        {name: t('entity-type.entityTypeManagement'), href: '/admin/entity-type', permission_level: 'managePanel'},
        {name: t('customer.manageCustomers'), href: '/admin/customer', permission_level: 'read'},
        {name: t('campaign.pageTitle'), href: '/admin/campaign', permission_level: 'read'},
        {name: t('measureValue.manageMeasureValues'), href: '/admin/measure-value', permission_level: 'managePanel'},
        {name: t('reminder.remindersAdminTitle'), href: '/admin/reminder', permission_level: 'read'},
        {name: t('meter.pageTitle'), href: '/admin/customer-measurement', permission_level: 'read'},
        {name: 'Tarieven', href: '/admin/tariff', permission_level: 'managePanel'},
    ];

    return (
        <div className="flex h-screen bg-cyan-950 text-white">
            <nav className="w-64 bg-cyan-900 p-6 flex flex-col justify-between h-screen">
                <div><h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
                    <ul className="space-y-4">
                        <li><LanguageSwitcher/></li>

                        {entityTypes.length > 1 ? (
                            <Dropdown entityTypes={entityTypes} languageCode={languageCode}/>
                        ) : (
                            entityTypes.map((item) => (
                                <li key={item.name}>
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
                                </li>
                            ))
                        )}

                        {navItems.filter(value => checkPermission(value.permission_level, session?.user?.role))
                            .map((item) => (
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
                </div>
                <div>
                    <SignOut/>
                </div>
            </nav>


            <main className="flex-1 p-8">
                <ToastingProvider>
                    {children}
                </ToastingProvider>
            </main>
        </div>
    );
}
