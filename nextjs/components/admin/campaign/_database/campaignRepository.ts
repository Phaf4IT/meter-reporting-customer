import {CampaignTable} from "@/components/admin/campaign/_database/campaignTable";
import {Campaign} from "@/components/admin/campaign/campaign";
import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {Customer} from "@/components/admin/customer/customer";
import {findCustomersByIds} from "@/components/admin/customer/_database/customerRepository";

export async function findCampaignsByCompany(company: string) {
    return getEntityManager(CampaignTable)
        .findBy({
            company: company
        })
        .then(async campaigns => {
                const customerIds: string[] = Array.from(new Set(campaigns.flatMap(value => value.customerIds)));
                const customers = await findCustomersByIds(customerIds, company);
                return campaigns.map(campaign => mapTableToDomain(campaign, customers));
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
            const customerIds: string[] = Array.from(new Set(campaigns.flatMap(value => value.customerIds)));
            const customers = await findCustomersByIds(customerIds, company);
            return campaigns.map(campaign => mapTableToDomain(campaign, customers))
                .find(() => true);
        })
}

export async function deleteCampaign(campaign: Campaign, company: string) {
    return getEntityManager(CampaignTable)
        .delete(mapDomainToTable(campaign, company))
}

export async function saveCampaign(campaign: Campaign, company: string) {
    return getEntityManager(CampaignTable)
        .create(mapDomainToTable(campaign, company))
        .then(async campaign => {
            const customers = await findCustomersByIds(campaign.customerIds, company);
            return mapTableToDomain(campaign, customers);
        });
}

export async function updateCampaign(campaign: Campaign, company: string) {
    return getEntityManager(CampaignTable)
        .update(mapDomainToTable(campaign, company))
        .then(campaign => campaign)
}

function mapTableToDomain(campaign: CampaignTable, customers: Customer[]): Campaign {
    return {
        name: campaign.name,
        customerEmails: campaign.customerIds.map(id => customers.find(c => c.id === id)!.email!),
        customerIds: campaign.customerIds,
        endDate: campaign.endDate,
        measureValues: campaign.measureValues,
        reminderDates: campaign.reminderDates,
        startDate: campaign.startDate,
    }
}

function mapDomainToTable(campaign: Campaign, company: string) {
    return new CampaignTable(
        campaign.name,
        campaign.startDate,
        campaign.endDate,
        campaign.reminderDates,
        campaign.customerIds,
        campaign.measureValues,
        company);
}