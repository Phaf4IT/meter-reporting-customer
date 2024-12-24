import React, {useState} from 'react';
import {CustomerMeasurement, MeasureValue} from "@/components/admin/customer-measurement/customerMeasurement";

interface CustomerMeasurementFormProps {
    customerMeasurement: CustomerMeasurement;
    onSave: (measurement: CustomerMeasurement) => void;
    isOverruling: boolean,
    onCancel: () => void;
}

export default function CustomerMeasurementForm({customerMeasurement, onSave, onCancel}: CustomerMeasurementFormProps) {
    const [measurements, setMeasurements] = useState<MeasureValue[]>(customerMeasurement.measurements);

    const handleChange = (name: string, value: string) => {
        setMeasurements(prev =>
            prev.map(m => m.name === name ? {...m, value} : m)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({...customerMeasurement, measurements});
    };

    return (
        <form onSubmit={handleSubmit} className="bg-cyan-900 p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">{`Overrule metingen voor ${customerMeasurement.campaignName} (${customerMeasurement.customerMail})`}</h2>
            {measurements.map((measurement) => (
                <div key={measurement.name} className="mb-4">
                    <label htmlFor={measurement.name} className="block font-medium">{measurement.name}</label>
                    <input
                        type="text"
                        id={measurement.name}
                        name={measurement.name}
                        value={measurement.value}
                        onChange={(e) => handleChange(measurement.name, e.target.value)}
                        className="border rounded w-full p-2 text-gray-900"
                    />
                </div>
            ))}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Overrule
            </button>
            <button type="button" onClick={onCancel}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Annuleer
            </button>
        </form>
    );
}
