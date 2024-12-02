'use server';

import {auth} from "@/auth"

export async function sendMeters(data: {
    gas: string;
    water: string;
    light: string;
}) {
    const session = await auth()

    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }

    // Valideer de gegevens
    if (!data.gas || !data.water || !data.light) {
        throw new Error('Alle velden zijn verplicht.');
    }

    // TODO controleer of er niet al gegevens in database zijn adhv session.user.email

    // Simuleer opslag in de database
    console.log('Opslaan in database:', {
        user: session.user?.email,
        ...data,
    });

    // Keer terug bij succes (optioneel)
    return {success: true};
}
