import {CampaignTable} from "@/components/admin/campaign/_database/campaignTable";
import {Campaign} from "@/components/admin/campaign/campaign";
import {getEntityManager} from "@/lib/jpa/entity-fetcher";

export async function findCampaignsByCompany(company: string) {
    return getEntityManager(CampaignTable)
        .findBy({
            company: company
        })
        .then(campaigns => campaigns.map(campaign => mapTableToDomain(campaign)
            )
        )
}

export async function findCampaignByCompanyAndName(name: string, company: string) {
    return getEntityManager(CampaignTable)
        .findBy({
            name: name,
            company: company
        })
        .then(campaigns => {
            return campaigns.map(campaign => mapTableToDomain(campaign))
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
        .then(campaign => mapTableToDomain(campaign));
}

export async function updateCampaign(campaign: Campaign, company: string) {
    return getEntityManager(CampaignTable)
        .update(mapDomainToTable(campaign, company))
        .then(campaign => campaign)
}

function mapTableToDomain(campaign: CampaignTable): Campaign {
    return {
        name: campaign.name,
        customerEmails: campaign.customerEmails,
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
        campaign.customerEmails,
        campaign.measureValues,
        company);
}