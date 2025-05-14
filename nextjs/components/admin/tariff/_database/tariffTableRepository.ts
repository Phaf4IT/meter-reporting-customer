// tariffRepository.ts
import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {TariffTable} from "@/components/admin/tariff/_database/tariffTable";
import {getUnit, Tariff} from "@/components/admin/tariff/tariff";
import {Logger} from "@/lib/logger";

export async function findTariffsByCompany(company: string) {
    return getEntityManager(TariffTable)
        .findBy({company})
        .then(tariffs => tariffs.map(mapTableToDomain));
}

export async function findTariffByCampaignAndCompany(campaignName: string, company: string) {
    return getEntityManager(TariffTable)
        .findBy({campaign_name: campaignName, company})
        .then(tariffs => tariffs.find(() => true)!) // Fetch first matching tariff
        .then(mapTableToDomain);
}

export async function saveTariff(tariff: Tariff, company: string) {
    return getEntityManager(TariffTable)
        .create(mapDomainToTable(tariff, company))
        .then(mapTableToDomain);
}

export async function updateTariff(tariff: Tariff, company: string) {
    return getEntityManager(TariffTable)
        .update(mapDomainToTable(tariff, company))
        .then(() => tariff);
}

export async function deleteTariff(tariff: Tariff, company: string) {
    return getEntityManager(TariffTable)
        .delete(mapDomainToTable(tariff, company));
}

function mapTableToDomain(tariffTable: TariffTable): Tariff {
    Logger.info(`TARIFF ${JSON.stringify(tariffTable)}`);
    return {
        id: tariffTable.id,
        campaignName: tariffTable.campaignName,
        customerIds: tariffTable.customerIds,
        description: tariffTable.description,
        measureValueName: tariffTable.measureValueName || undefined,
        rate: Number.parseFloat(tariffTable.rate),
        currency: tariffTable.currency,
        unit: getUnit(tariffTable.unit),
        rangeFrom: tariffTable.rangeFrom ? Number.parseFloat(tariffTable.rangeFrom) : undefined,
        rangeTo: tariffTable.rangeTo ? Number.parseFloat(tariffTable.rangeTo) : undefined,
        validFrom: tariffTable.validFrom,
        validTo: tariffTable.validTo || undefined,
        isDeposit: tariffTable.isDeposit
    };
}

function mapDomainToTable(tariff: Tariff, company: string): TariffTable {
    return TariffTable.of({
        id: tariff.id,
        campaignName: tariff.campaignName,
        measureValueName: tariff.measureValueName || null,
        rangeFrom: tariff.rangeFrom ? tariff.rangeFrom.toFixed(2) : null,
        rangeTo: tariff.rangeTo ? tariff.rangeTo.toFixed(2) : null,
        validTo: tariff.validTo || null,
        validFrom: tariff.validFrom,
        customerIds: tariff.customerIds,
        description: tariff.description,
        rate: tariff.rate.toFixed(2),
        currency: tariff.currency,
        unit: tariff.unit,
        company,
        isDeposit: tariff.isDeposit
    });
}
