import React from 'react';
import {Tariff} from './tariff';
import {useLocale, useTranslations} from 'next-intl';

interface TariffTableProps {
    tariffs: Tariff[];
    onEdit: (id: string) => void;
    onDelete: (tariff: Tariff) => void;
}

export const TariffTable: React.FC<TariffTableProps> = ({tariffs, onEdit, onDelete}) => {
    const locale = useLocale();
    const t = useTranslations('admin.tariff');

    if (tariffs.length === 0) {
        return <div>{'Er zijn geen tarieven beschikbaar.'}</div>;
    }

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-cyan-950">
            <table className="min-w-full text-white">
                <thead>
                <tr className="bg-cyan-800">
                    <th className="px-4 py-2 text-left">{'Campaign Name'}</th>
                    <th className="px-4 py-2 text-left">{'Rate'}</th>
                    <th className="px-4 py-2 text-left">{'Currency'}</th>
                        <th className="px-4 py-2 text-left">{'Unit'}</th>
                        <th className="px-4 py-2 text-left">{'Measure Value'}</th>
                        <th className="px-4 py-2 text-left">{'Range'}</th>
                        <th className="px-4 py-2 text-left">{'Valid From'}</th>
                        <th className="px-4 py-2 text-left">{'Valid To'}</th>
                        <th className="px-4 py-2 text-left">Acties</th>
                </tr>
                </thead>
                <tbody>
                {tariffs.map((tariff) => (
                    <tr key={tariff.id} className="border-b border-cyan-800 hover:bg-cyan-700">
                        <td className="px-4 py-2">{tariff.campaignName}</td>
                        <td className="px-4 py-2">{tariff.rate}</td>
                        <td className="px-4 py-2">{tariff.currency}</td>
                            <td className="px-4 py-2">{t(tariff.unit)}</td>
                            <td className="px-4 py-2">{tariff.measureValueName || 'N/A'}</td>
                            <td className="px-4 py-2">
                                {tariff.rangeFrom !== undefined && tariff.rangeTo !== undefined
                                    ? `${tariff.rangeFrom} - ${tariff.rangeTo}`
                                    : tariff.rangeFrom || tariff.rangeTo || 'N/A'}
                            </td>
                            <td className="px-4 py-2">{tariff.validFrom.toLocaleDateString(locale)}</td>
                            <td className="px-4 py-2">
                                {tariff.validTo ? tariff.validTo.toLocaleDateString(locale) : 'N/A'}
                            </td>
                        <td className="px-4 py-2">
                            <button
                                onClick={() => onEdit(tariff.id)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                            >
                                Bewerken
                            </button>
                            <button
                                onClick={() => onDelete(tariff)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Verwijderen
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
