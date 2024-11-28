'use client';
import {FormEvent} from "react";

export default function Page() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = {
            gas: (e.target as HTMLFormElement).gas.value,
            water: (e.target as HTMLFormElement).water.value,
            light: (e.target as HTMLFormElement).light.value,
        };

        await fetch('/api/send-meters', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
        });
    };

    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Voer je verbruik in</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="gas" className="block font-medium">
            Gasverbruik (m³)
          </label>
          <input
            type="number"
            id="gas"
            name="gas"
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="water" className="block font-medium">
            Waterverbruik (m³)
          </label>
          <input
            type="number"
            id="water"
            name="water"
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="light" className="block font-medium">
            Elektriciteitsverbruik (kWh)
          </label>
          <input
            type="number"
            id="light"
            name="light"
            required
            className="border rounded w-full p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Opslaan
        </button>
      </form>
    </div>
  );
}