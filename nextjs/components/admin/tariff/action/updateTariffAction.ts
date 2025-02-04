// updateTariffAction.ts
import { Tariff } from '@/components/admin/tariff/tariff';
import {updateTariff} from "@/components/admin/tariff/_database/tariffTableRepository";

export async function updateTariffAction(tariff: Tariff, company: string): Promise<Tariff> {
    // De tarif kan geüpdatet worden op basis van het `company` en andere sleutelwaarden
    // We gebruiken de `updateTariff` functie van de repository om de tariff bij te werken
    await updateTariff(tariff, company);

    // Retourneer het bijgewerkte tariff
    return tariff;
}
