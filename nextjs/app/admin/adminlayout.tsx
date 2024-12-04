'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Klanten Beheren', href: '/admin/customer' },
        { name: 'Campagnes Instellen', href: '/admin/campaign' },
        { name: 'Meterwaardes Bekijken', href: '/admin/meter' },
    ];

    return (
        <div className="flex min-h-screen bg-cyan-950 text-white">
            {/* Sidebar */}
            <nav className="w-64 bg-cyan-900 p-6">
                <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
                <ul className="space-y-4">
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
