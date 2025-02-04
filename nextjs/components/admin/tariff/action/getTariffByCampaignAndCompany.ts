// getTariffByCampaignAndCompanyAction.ts
import {Tariff} from '@/components/admin/tariff/tariff';
import {findTariffByCampaignAndCompany} from "@/components/admin/tariff/_database/tariffTableRepository";

export async function getTariffByCampaignAndCompany(campaignName: string, company: string): Promise<Tariff | undefined> {
    // Gebruik de repository om de tariff te vinden
    const tariff = await findTariffByCampaignAndCompany(campaignName, company);

    // Als er geen tariff gevonden is, return undefined
    return tariff ? tariff : undefined;
}
