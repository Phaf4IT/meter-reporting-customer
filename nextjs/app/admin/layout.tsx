'use server';

import {SessionProvider} from "next-auth/react";
import AdminLayout from "@/app/admin/adminlayout";

export default async function Layout({children}: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AdminLayout>{children}</AdminLayout>
        </SessionProvider>
    );
}