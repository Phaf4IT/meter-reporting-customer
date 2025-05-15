'use client';

import {useState} from 'react';
import {BiUpArrow} from "react-icons/bi";
import Link from "next/link";

interface Props {
    onSuccess?: () => void;
}

export default function CustomerImport({ onSuccess }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setStatus('uploading');
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/import-customers', {
                method: 'POST',
                body: formData,
            });

            const json = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(`✅ ${json.count} klanten succesvol geïmporteerd.`);
                onSuccess?.(); // 🚀 Trigger herladen van klanten
            } else {
                setStatus('error');
                setMessage(`❌ Fout bij importeren: ${json.message || 'Onbekende fout'}`);
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage('❌ Upload mislukt, probeer opnieuw.');
        }
    };

    return (
        <div className="w-full max-w-lg bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
            <h2 className="text-xl font-bold">Importeer klanten (CSV)</h2>

            <Link href={'/customer.csv'}>Download hier een voorbeeld csv</Link>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="file" className="block text-sm font-medium mb-1">
                        Upload CSV-bestand
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="file"
                            id="file"
                            accept=".csv,text/csv"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-white bg-cyan-800 border border-cyan-700 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                            required
                        />
                        <BiUpArrow className="w-5 h-5 text-cyan-300"/>
                    </div>
                    <p className="text-xs text-cyan-200 mt-1">Bestand moet kommagescheiden (.csv of .tsv) zijn.</p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    disabled={status === 'uploading'}
                >
                    {status === 'uploading' ? 'Uploaden...' : 'Uploaden'}
                </button>

                {message && (
                    <div
                        className={`mt-2 text-sm font-medium ${
                            status === 'success'
                                ? 'text-green-300'
                                : status === 'error'
                                    ? 'text-red-300'
                                    : 'text-cyan-200'
                        }`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
