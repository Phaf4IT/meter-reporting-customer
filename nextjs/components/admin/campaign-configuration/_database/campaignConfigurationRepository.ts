import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {
    CampaignConfigurationTable
} from "@/components/admin/campaign-configuration/_database/campaignConfigurationTable";
import {Entity} from "@/components/admin/entity/entity";
import {
    CampaignConfiguration,
    SimpleCampaignConfiguration
} from "@/components/admin/campaign-configuration/campaignConfiguration";
import {isEmpty} from "lodash";
import {NoCampaignFoundError} from "@/components/admin/campaign/_database/campaignRepository";
import {findEntitiesByCompanyAndIds} from "@/components/admin/entity/_database/entityRepository";
import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import {findMeasureValuesByNames} from "@/components/admin/measure-value/_database/measureValueRepository";

export async function findCampaignConfigurationsByCompany(company: string) {
    return getEntityManager(CampaignConfigurationTable)
        .findBy({
            company: company
        })
        .then(async campaigns => {
                const entityIds: string[] = Array.from(new Set(campaigns.flatMap(value => value.entityIds)));
                const entities = await findEntitiesByCompanyAndIds(entityIds, company);
                const measureValues = await findMeasureValuesByNames(campaigns.flatMap(value => value.measureValueNames), company);
                return campaigns.map(campaign => mapTableToDomain(campaign, entities, measureValues));
            }
        )
}

export async function findCampaignConfigurationByCompanyAndName(name: string, company: string) {
    return getEntityManager(CampaignConfigurationTable)
        .findBy({
            name: name,
            company: company
        })
        .then(async campaigns => {
            if (isEmpty(campaigns)) {
                throw new NoCampaignFoundError("No campaign found.");
            }
            const entityIds: string[] = Array.from(new Set(campaigns.flatMap(value => value.entityIds)));
            const entities = await findEntitiesByCompanyAndIds(entityIds, company);
            const measureValues = await findMeasureValuesByNames(campaigns.flatMap(value => value.measureValueNames), company);
            return campaigns.map(campaign => mapTableToDomain(campaign, entities, measureValues))
                .find(() => true);
        })
}

export async function findSimpleCampaignConfigurationByCompanyAndName(name: string, company: string) {
    return getEntityManager(CampaignConfigurationTable)
        .findBy({
            name: name,
            company: company
        })
        .then(async campaigns => {
            if (isEmpty(campaigns)) {
                throw new NoCampaignFoundError("No campaign found.");
            }
            const measureValues = await findMeasureValuesByNames(campaigns.flatMap(value => value.measureValueNames), company);
            return campaigns.map(campaign => mapTableToSimpleDomain(campaign, measureValues))
                .find(() => true);
        })
}

export async function findCampaignConfigurationsByCompanyAndName(name: string[], company: string) {
    return getEntityManager(CampaignConfigurationTable)
        .findBy({
            name: name,
            company: company
        })
        .then(async campaigns => {
            if (isEmpty(campaigns)) {
                throw new NoCampaignFoundError("No campaign found.");
            }
            const entityIds: string[] = Array.from(new Set(campaigns.flatMap(value => value.entityIds)));
            const entities = await findEntitiesByCompanyAndIds(entityIds, company);
            const measureValues = await findMeasureValuesByNames(campaigns.flatMap(value => value.measureValueNames), company);
            return campaigns.map(campaign => mapTableToDomain(campaign, entities, measureValues));
        })
}

export async function findSimpleCampaignConfigurationsByCompanyAndName(name: string[], company: string) {
    return getEntityManager(CampaignConfigurationTable)
        .findBy({
            name: name,
            company: company
        })
        .then(async campaigns => {
            if (isEmpty(campaigns)) {
                throw new NoCampaignFoundError("No campaign found.");
            }
            const measureValues = await findMeasureValuesByNames(campaigns.flatMap(value => value.measureValueNames), company);
            return campaigns.map(campaign => mapTableToSimpleDomain(campaign, measureValues));
        })
}


export async function deleteCampaignConfiguration(campaign: CampaignConfiguration, company: string) {
    return getEntityManager(CampaignConfigurationTable)
        .delete(mapDomainToTable(campaign, company))
}

export async function saveCampaignConfiguration(campaign: CampaignConfiguration, company: string) {
    return getEntityManager(CampaignConfigurationTable)
        .create(mapDomainToTable(campaign, company))
        .then(async campaignTable => {
            const entities = await findEntitiesByCompanyAndIds(campaignTable.entityIds, company);
            return mapTableToDomain(campaignTable, entities, campaign.measureValues);
        });
}


function mapTableToDomain(campaign: CampaignConfigurationTable, entities: Entity[], measureValues: MeasureValue[]): CampaignConfiguration {
    return {
        name: campaign.name,
        entities: campaign.entityIds.map(id => entities.find(c => c.id === id)!),
        measureValues: measureValues.filter(value => campaign.measureValueNames.includes(value.name)),
    }
}


function mapTableToSimpleDomain(campaign: CampaignConfigurationTable, measureValues: MeasureValue[]): SimpleCampaignConfiguration {
    return {
        name: campaign.name,
        entityIds: campaign.entityIds,
        measureValues: measureValues.filter(value => campaign.measureValueNames.includes(value.name)),
    }
}

function mapDomainToTable(campaign: CampaignConfiguration, company: string) {
    return CampaignConfigurationTable.of(
        {
            name: campaign.name,
            entityIds: campaign.entities.map(e => e.id!),
            measureValueNames: campaign.measureValues.map(value => value.name),
            company
        });
}
