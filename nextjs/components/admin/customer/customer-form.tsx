import {Customer} from "@/app/admin/customer/customer";
import React, {useState} from 'react';
import {useTranslations} from "next-intl";
import {FaTrashAlt} from "react-icons/fa";


export default function CustomerForm({
                                         customer,
                                         isNew,
                                         onSave,
                                         onCancel,
                                     }: {
    customer: Customer;
    isNew: boolean;
    onSave: (customer: Customer, isNew: boolean) => void;
    onCancel: () => void;
}) {
    
    const [formData, setFormData] = useState<Customer>({
        ...customer,
        streetLines: customer.streetLines || [],  
    });

    const t = useTranslations('admin.customer');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, isNew);
    };

    const handleStreetLineChange = (index: number, value: string) => {
        const updatedStreetLines = [...formData.streetLines];
        updatedStreetLines[index] = value;
        setFormData({...formData, streetLines: updatedStreetLines});
    };

    const addStreetLine = () => {
        setFormData({
            ...formData,
            streetLines: [...formData.streetLines, ''],
        });
    };

    const removeStreetLine = (index: number) => {
        if (formData.streetLines.length > 1) {
            const newStreetLines = formData.streetLines.filter((_, i) => i !== index);
            setFormData({...formData, streetLines: newStreetLines});
        }
    };

    const getStreetLineLabel = (index:number) => {
        if(index == 0){
            return 'address'
        } else if(index == 1){
            return 'addressAdditional'
        } else {
            return 'addressOther'
        }
    }

    return (
        <form onSubmit={handleSubmit}
              className="w-full max-w-lg bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
            {/* Email, First Name, etc. */}
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
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
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="firstName">
                        {t('firstName')}
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
            </div>

            {/* Middle Name, Last Name */}
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="middleName">
                        {t('middleName')}
                    </label>
                    <input
                        type="text"
                        id="middleName"
                        value={formData.middleName || ''}
                        onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="lastName">
                        {t('lastName')}
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
            </div>

            {/* Address (Street Lines) */}
            <div className="space-y-4">
                <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2">
                    {t('addressLines')}
                </label>
                {formData.streetLines.map((line, index) => (
  <div key={index} className="flex flex-col space-y-2 items-start w-full">

    <div className="flex space-x-4 items-center w-full">
                            <input
                                type="text"
                                value={line}
                                onChange={(e) => handleStreetLineChange(index, e.target.value)}
                                className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                            />
                            {index > 0 ?
                                <button
                                    type="button"
                                    onClick={() => removeStreetLine(index)}
                                    className="text-red-500 hover:text-red-700 focus:outline-none ml-2"
                                >
                                    <FaTrashAlt/>
                                </button> : null
                            }
                        </div>

                        <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2">
                            {t(getStreetLineLabel(index))}
                        </label>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addStreetLine}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {t('addStreetLine')}
                </button>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="postal-code">
                        {t('postalCode')}
                    </label>
                    <input
                        type="text"
                        id="postal-code"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
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
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
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
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="province">
                        {t('province')}
                    </label>
                    <input
                        type="text"
                        id="province"
                        value={formData.stateOrProvinceCode}
                        onChange={(e) => setFormData({...formData, stateOrProvinceCode: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="phone-number">
                        {t('phoneNumber')}
                    </label>
                    <input
                        type="text"
                        id="phone-number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
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
