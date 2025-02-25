import {CampaignTable} from "@/components/admin/campaign/_database/campaignTable";
import {Campaign} from "@/components/admin/campaign/campaign";
import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {Customer} from "@/components/admin/customer/customer";
import {findCustomersByIds} from "@/components/admin/customer/_database/customerRepository";
import {ModifiableCampaign} from "@/app/api/admin/campaign/route";
import {isEmpty} from "lodash";
import {
    findSimpleCampaignConfigurationByCompanyAndName,
    findSimpleCampaignConfigurationsByCompanyAndName
} from "@/components/admin/campaign-configuration/_database/campaignConfigurationRepository";
import {SimpleCampaignConfiguration} from "@/components/admin/campaign-configuration/campaignConfiguration";

export async function findCampaignsByCompany(company: string) {
    return getEntityManager(CampaignTable)
        .findBy({
            company: company
        })
        .then(async campaigns => {
                const customerIds: string[] = Array.from(new Set(campaigns.flatMap(value => value.customerIds)));
                const customers = await findCustomersByIds(customerIds, company);
                const configs = await findSimpleCampaignConfigurationsByCompanyAndName(campaigns.map(value => value.campaignConfigurationName), company)
                return campaigns.map(campaign => mapTableToDomain(campaign, customers, configs));
            }
        )
}

export async function findCampaignByCompanyAndName(name: string, company: string) {
    return getEntityManager(CampaignTable)
        .findBy({
            name: name,
            company: company
        })
        .then(async campaigns => {
            if (isEmpty(campaigns)) {
                throw new NoCampaignFoundError("No campaign found.");
            }
            const customerIds: string[] = Array.from(new Set(campaigns.flatMap(value => value.customerIds)));
            const customers = await findCustomersByIds(customerIds, company);
            const configs = await findSimpleCampaignConfigurationsByCompanyAndName(campaigns.map(value => value.campaignConfigurationName), company)
            return campaigns.map(campaign => mapTableToDomain(campaign, customers, configs))
                .find(() => true);
        })
}

export async function deleteCampaign(campaign: ModifiableCampaign, company: string) {
    return getEntityManager(CampaignTable)
        .delete(mapDomainToTable(campaign, company))
}

export async function saveCampaign(campaign: ModifiableCampaign, company: string) {
    return getEntityManager(CampaignTable)
        .create(mapDomainToTable(campaign, company))
        .then(async campaign => {
            const customers = await findCustomersByIds(campaign.customerIds, company);
            const configs = await findSimpleCampaignConfigurationByCompanyAndName(campaign.campaignConfigurationName, company);
            return mapTableToDomain(campaign, customers, [configs!]);
        });
}

export async function updateCampaign(campaign: ModifiableCampaign, company: string) {
    return getEntityManager(CampaignTable)
        .update(mapDomainToTable(campaign, company))
        .then(campaign => campaign)
}

function mapTableToDomain(campaign: CampaignTable, customers: Customer[], campaignConfigurations: SimpleCampaignConfiguration[]): Campaign {
    return {
        name: campaign.name,
        customers: campaign.customerIds.map(id => customers.find(c => c.id === id)!),
        endDate: campaign.endDate,
        measureValues: campaignConfigurations.find(value => value.name === campaign.campaignConfigurationName)!.measureValues,
        reminderDates: campaign.reminderDates,
        startDate: campaign.startDate,
        configurationName: campaign.campaignConfigurationName,
        type: campaign.type
    }
}

function mapDomainToTable(campaign: ModifiableCampaign, company: string) {
    return CampaignTable.of(
        {
            name: campaign.name,
            campaignConfigurationName: campaign.configurationName,
            type: campaign.type,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            reminderDates: campaign.reminderDates,
            customerIds: campaign.customerIds,
            company
        });
}


export class NoCampaignFoundError extends Error {
}
