'use client';
import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {sendMeters} from './sendMetersAction';
import {useTranslations} from 'next-intl';
import LanguageSwitcher from "@/app/languageswitcher";

export default function FormPage() {
    const t = useTranslations('form');
    const router = useRouter();
    const [formData, setFormData] = useState({
        gas: '',
        water: '',
        light: '',
    });
    const [, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            await sendMeters(formData);

            router.push(
                `/success?gas=${formData.gas}&water=${formData.water}&light=${formData.light}`
            );
        } catch (err: any) {
            setError(err.message || 'Er ging iets mis.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  bg-cyan-950">
            <LanguageSwitcher/>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <form onSubmit={handleSubmit} className=" bg-cyan-900 p-6 rounded shadow-md">
                <div className="mb-4">
                    <label htmlFor="gas" className="block font-medium">
                        {t('gas')}
                    </label>
                    <input
                        type="number"
                        id="gas"
                        name="gas"
                        value={formData.gas}
                        onChange={handleChange}
                        required
                        className="border rounded w-full p-2 text-gray-900"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="water" className="block font-medium">
                        {t('water')}
                    </label>
                    <input
                        type="number"
                        id="water"
                        name="water"
                        value={formData.water}
                        onChange={handleChange}
                        required
                        className="border rounded w-full p-2 text-gray-900"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="light" className="block font-medium">
                        {t('light')}
                    </label>
                    <input
                        type="number"
                        id="light"
                        name="light"
                        value={formData.light}
                        onChange={handleChange}
                        required
                        className="border rounded w-full p-2 text-gray-900"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {t('submit')}
                </button>
            </form>
        </div>
    );
}
