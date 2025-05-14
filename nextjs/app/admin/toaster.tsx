'use client'
import ToastProvider from '@/components/admin/toast-context';
import Toaster from "@/components/admin/toaster";
import React from "react";

export const ToastingProvider = ({children}: { children: React.ReactNode }) => {
    return (
        <ToastProvider>
            <Toaster/>
            {children}
        </ToastProvider>
    )
}