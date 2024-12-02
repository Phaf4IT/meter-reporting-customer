'use client';

import React, {useEffect, useState} from 'react';
import {Customer, getCustomers} from "@/app/admin/customer/getCustomer";
import {FaTrashAlt} from "react-icons/fa";
import {saveCustomer} from "@/app/admin/customer/saveCustomer";
import {deleteCustomer} from "@/app/admin/customer/deleteCustomer";
import AdminLayout from "@/app/admin/adminlayout";
import {useTranslations} from "next-intl";

export default function CustomersPage() {
    const t = useTranslations('admin.customer'); // Gebruik de juiste namespace voor vertalingen
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        async function fetchCustomers() {
            const data: Customer[] = await getCustomers();
            setCustomers(data);
        }

        fetchCustomers();
    }, []);

    const handleSave = async (customer: Customer) => {
        const updatedCustomer = await saveCustomer(customer)
        if (updatedCustomer) {
            setCustomers((prev) =>
                customer.id
                    ? prev.map((c) => (c.id === customer.id ? updatedCustomer : c))
                    : [...prev, updatedCustomer]
            );
            setEditingCustomer(null);
        } else {
            console.error('Failed to save customer');
        }
    };

    const handleDelete = async (id: string) => {
        const isSuccess = await deleteCustomer(id);
        if (isSuccess) {
            setCustomers((prev) => prev.filter((c) => c.id !== id));
        } else {
            console.error('Failed to delete customer');
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold mb-6"> {t('manageCustomers')}</h1>
                {editingCustomer ? (
                    <CustomerForm
                        customer={editingCustomer}
                        onSave={handleSave}
                        onCancel={() => setEditingCustomer(null)}
                    />
                ) : (
                    <>
                        <button
                            onClick={() =>
                                setEditingCustomer({
                                    id: '',
                                    email: '',
                                    first_name: '',
                                    middle_name: '',
                                    last_name: '',
                                    street_lines: [''],
                                    postal_code: '',
                                    city: '',
                                    country: '',
                                    state_or_province_code: '',
                                    phone_number: '',
                                })
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
                                <tr key={customer.id} className="border-b border-cyan-700">
                                    <td className="py-2 px-4">{customer.email}</td>
                                    <td className="py-2 px-4">
                                        {customer.first_name}{' '}
                                        {customer.middle_name ? `${customer.middle_name} ` : ''}
                                        {customer.last_name}
                                    </td>
                                    <td className="py-2 px-4">
                                        {customer.street_lines.join(', ')}, {customer.postal_code}{' '}
                                        {customer.city}, {customer.country}
                                    </td>
                                    <td className="py-2 px-4">{customer.phone_number}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button
                                            onClick={() => setEditingCustomer(customer)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            {t('edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id)}
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
            </div>
        </AdminLayout>
    );
}

function CustomerForm({
                          customer,
                          onSave,
                          onCancel,
                      }: {
    customer: Customer;
    onSave: (customer: Customer) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<Customer>(customer);
    const t = useTranslations('admin.customer'); // Gebruik de juiste namespace voor vertalingen

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleStreetLineChange = (index: number, value: string) => {
        const updatedStreetLines = [...formData.street_lines];
        updatedStreetLines[index] = value;
        setFormData({...formData, street_lines: updatedStreetLines});
    };

    const addStreetLine = () => {
        setFormData({
            ...formData,
            street_lines: [...formData.street_lines, ''],
        });
    };

    const removeStreetLine = (index: any) => {
        if (formData.street_lines.length > 1) {  // Zorg ervoor dat er minstens één regel overblijft
            const newStreetLines = formData.street_lines.filter((_, i) => i !== index);
            setFormData({...formData, street_lines: newStreetLines});
        }
    };

    return (
        <form onSubmit={handleSubmit}
              className="w-full max-w-lg bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="first-name">
                        {t('firstName')}
                    </label>
                    <input
                        type="text"
                        id="first-name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="middle-name">
                        {t('middleName')}
                    </label>
                    <input
                        type="text"
                        id="middle-name"
                        value={formData.middle_name || ''}
                        onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="last-name">
                        {t('lastName')}
                    </label>
                    <input
                        type="text"
                        id="last-name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="street-lines">
                        {t('streetLines')}
                    </label>
                    {formData.street_lines.map((line, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-3">
                            <input
                                type="text"
                                value={line}
                                onChange={(e) => handleStreetLineChange(index, e.target.value)}
                                className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                            />
                            {formData.street_lines.length > 1 && index !== 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeStreetLine(index)}
                                    className="text-red-500 hover:text-red-700 focus:outline-none ml-2"
                                >
                                    <FaTrashAlt/>
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addStreetLine}
                        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
                    >
                        {t('addStreetLine')}
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="postal-code">
                        {t('postalCode')}
                    </label>
                    <input
                        type="text"
                        id="postal-code"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="city">
                        {t('city')}
                    </label>
                    <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="country">
                        {t('country')}
                    </label>
                    <input
                        type="text"
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="province">
                        {t('province')}
                    </label>
                    <input
                        type="text"
                        id="province"
                        value={formData.state_or_province_code}
                        onChange={(e) => setFormData({...formData, state_or_province_code: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2"
                           htmlFor="phone-number">
                        {t('phoneNumber')}
                    </label>
                    <input
                        type="text"
                        id="phone-number"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
                    {t('save')}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
                >
                    {t('cancel')}
                </button>
            </div>
        </form>

    );
}
