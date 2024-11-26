'use client';
import {FormEvent} from "react";

export default async function Page() {
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
        <form onSubmit={handleSubmit}>
            <input name="gas" placeholder="Gas" type="number" required/>
            <input name="water" placeholder="Water" type="number" required/>
            <input name="light" placeholder="Licht" type="number" required/>
            <button type="submit">Opslaan</button>
        </form>
    );
}