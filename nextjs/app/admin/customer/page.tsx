"use client"
import React, {useEffect, useState} from 'react';
import AdminLayout from "@/app/admin/adminlayout";
import {useTranslations} from "next-intl";
import {Customer} from "@/app/admin/customer/customer";
import CustomerForm from "@/components/admin/customer/customer-form";
import ConfirmationDialog from "@/components/admin/confirmation-dialog"; // Import confirmation dialog
import "@/components/dialog-styles.css";
import {deleteCustomer, getCustomers, saveCustomer} from "@/app/admin/customer/client";

export default function CustomersPage() {
    const t = useTranslations('admin.customer');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    useEffect(() => {
        getCustomers()
            .then(customers => {
                setCustomers(customers);
            })
    }, []);

    const handleSave = async (customer: Customer, isNew: boolean) => {
        saveCustomer(customer, isNew)
            .then(customerToAdd => {
                setCustomers((prev) => {
                        const c = prev.find(c => c.email === customerToAdd.email)
                        return c ? prev.map((c) => (c.email === customerToAdd.email ? customerToAdd : c)) : [...prev, customerToAdd];
                    }
                );
                setEditingCustomer(null);
            });
    };

    const openDialog = (customer: Customer) => {
        setCustomerToDelete(customer);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setCustomerToDelete(null);
        setIsDialogOpen(false);
    };

    const handleDelete = async () => {
        if (customerToDelete) {
            const isSuccess = await deleteCustomer(customerToDelete);
            if (isSuccess) {
                setCustomers((prev) => prev.filter((c) => c.email !== customerToDelete.email));
                closeDialog();
            } else {
                console.error('Failed to delete customer');
            }
        }
    };

    const openEditor = (customer: Customer, isNew: boolean) => {
        setEditingCustomer(customer);
        setIsNew(isNew);
    }

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6">{t('manageCustomers')}</h1>
                {editingCustomer ? (
                    <CustomerForm
                        customer={editingCustomer}
                        isNew={isNew}
                        onSave={handleSave}
                        onCancel={() => setEditingCustomer(null)}
                    />
                ) : (
                    <>
                        <button
                            onClick={() =>
                                openEditor(new Customer(
                                    '', '', '', '', [''], '', '', '', '', ''
                                ), true)
                            }
                            className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600"
                        >
                            {t('newCustomer')}
                        </button>
                        <table className="table-auto w-full border-collapse bg-cyan-900 text-white rounded shadow-lg">
                            <thead>
                            <tr className="border-b border-cyan-700">
                                <th className="py-2 px-4 text-left">{t('email')}</th>
                                <th className="py-2 px-4 text-left">{t('name')}</th>
                                <th className="py-2 px-4 text-left">{t('address')}</th>
                                <th className="py-2 px-4 text-left">{t('phoneNumber')}</th>
                                <th className="py-2 px-4 text-left">{t('actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.email} className="border-b border-cyan-700">
                                    <td className="py-2 px-4">{customer.email}</td>
                                    <td className="py-2 px-4">
                                        {customer.firstName}{' '}
                                        {customer.middleName ? `${customer.middleName} ` : ''}
                                        {customer.lastName}
                                    </td>
                                    <td className="py-2 px-4">
                                        {customer.streetLines.join(', ')}, {customer.postalCode}{' '}
                                        {customer.city}, {customer.country}
                                    </td>
                                    <td className="py-2 px-4">{customer.phoneNumber}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => openEditor(customer, false)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            {t('edit')}
                                        </button>
                                        <button
                                            onClick={() => openDialog(customer)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            {t('delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
                <ConfirmationDialog
                    isOpen={isDialogOpen}
                    onClose={closeDialog}
                    onConfirm={handleDelete}
                    title={t("deleteConfirmationTitle")}
                    message={t("deleteConfirmationMessage")}
                    confirmText={t("confirmDeleteButton")}
                    cancelText={t("cancelButton")}
                />
            </div>
        </AdminLayout>
    );
}
