import {CampaignTable} from "@/app/api/admin/campaign/_database/campaignTable";
import {Campaign} from "@/app/admin/campaign/campaign";
import {getEntityManager} from "@/lib/jpa/entity-fetcher";

export async function findCampaigns(company: string) {
    return getEntityManager(CampaignTable)
        .findBy(CampaignTable, {
            company: company
        })
        .then(campaigns => campaigns.map(campaign => mapTableToDomain(campaign)
            )
        )
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
        customerEmails: campaign.customer_emails,
        endDate: campaign.end_date,
        measureValues: campaign.measure_values,
        reminderDates: campaign.reminder_dates,
        startDate: campaign.start_date,
    }
}

function mapDomainToTable(campaign: Campaign, company: string) {
    return new CampaignTable(
        campaign.startDate,
        campaign.endDate,
        campaign.reminderDates,
        campaign.customerEmails,
        campaign.measureValues,
        company);
}