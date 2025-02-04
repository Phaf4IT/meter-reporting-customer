// deleteTariffAction.ts
import {Tariff} from '@/components/admin/tariff/tariff';
import {deleteTariff} from "@/components/admin/tariff/_database/tariffTableRepository";

export async function removeTariff(tariff: Tariff, company: string): Promise<void> {
    // Verwijder de tariff via de repository
    await deleteTariff(tariff, company);
}
