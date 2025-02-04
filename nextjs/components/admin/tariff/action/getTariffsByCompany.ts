// getTariffsByCompanyAction.ts
import { Tariff } from '@/components/admin/tariff/tariff';
import {findTariffsByCompany} from "@/components/admin/tariff/_database/tariffTableRepository";

export async function getTariffsByCompany(company: string): Promise<Tariff[]> {
    // Gebruik de repository om alle tariffs voor het bedrijf op te halen
    const tariffs = await findTariffsByCompany(company);

    // Retourneer de lijst met tariffs
    return tariffs;
}
