// tariff.ts

import {Tariff, tariffFromJson} from "@/components/admin/tariff/tariff";

// Haal een specifieke tariff op via de ID (bijvoorbeeld voor een campagne en bedrijf)
export async function getTariff(campaignName: string): Promise<Tariff> {
    const response = await fetch(`/api/admin/tariff?campaign=${campaignName}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch tariff: ${response.status}`);
    }

    const tariff = await response.json();
    return tariffFromJson(tariff);
}

// Opslaan of bijwerken van een tariff
export async function saveTariff(tariff: Tariff): Promise<Tariff> {
    const response = await fetch('/api/admin/tariff', {
        method: tariff.id ? 'PUT' : 'POST',  // PUT als er een id is, anders POST
        body: JSON.stringify(tariff),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to save tariff: ${response.status}`);
    }

    const savedTariff = await response.json();
    return tariffFromJson(savedTariff);
}

// Haal alle tariffs op voor een bepaald bedrijf
export async function getTariffs(): Promise<Tariff[]> {
    const response = await fetch(`/api/admin/tariff`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch tariffs: ${response.statusText}`);
    }

    const tariffs = await response.json();
    return tariffs.map(tariffFromJson);
}

// Haal alle tariffs op voor een bepaald type
export async function getTariffsByType(type: string): Promise<Tariff[]> {
    const response = await fetch(`/api/admin/tariff?type=${type}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch tariffs by type: ${response.statusText}`);
    }

    const tariffs = await response.json();
    return tariffs.map(tariffFromJson);
}

// Verwijder een specifieke tariff
export async function deleteTariff(tariff: Tariff): Promise<void> {
    const response = await fetch(`/api/admin/tariff`, {
        method: 'DELETE',
        body: JSON.stringify(tariff),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to delete tariff: ${response.statusText}`);
    }

    return;
}
