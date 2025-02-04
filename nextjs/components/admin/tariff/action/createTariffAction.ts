// createTariffAction.ts
import {Tariff} from '@/components/admin/tariff/tariff';
import {saveTariff} from "@/components/admin/tariff/_database/tariffTableRepository";

export async function createTariff(tariff: Tariff, company: string): Promise<Tariff> {
    // Zorg ervoor dat de gegevens correct zijn voordat je ze opslaat
    return saveTariff(tariff, company);
}
