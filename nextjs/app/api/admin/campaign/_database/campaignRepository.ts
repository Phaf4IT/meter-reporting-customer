// "use server"
import {CampaignTable} from "@/app/api/admin/campaign/_database/campaignTable";
import {Campaign} from "@/app/admin/campaign/campaign";
import {getEntityManager} from "@/lib/jpa/entity-fetcher";


export async function findCampaigns(company: string) {
    return getEntityManager(CampaignTable)
        .findBy(CampaignTable, {
            company: company
        })
        .then(campaigns => campaigns.map(campaign => new Campaign(
                campaign.customer_emails,
                campaign.end_date,
                campaign.measure_values,
                campaign.reminder_dates,
                campaign.start_date)
            )
        )
}

export async function deleteCampaign(campaign: Campaign, company: string) {
    return getEntityManager(CampaignTable)
        .delete(new CampaignTable(
            campaign.startDate,
            campaign.endDate,
            campaign.reminderDates,
            campaign.customerEmails,
            campaign.measureValues,
            company))
}

export async function saveCampaign(campaign: Campaign, company: string) {
    return getEntityManager(CampaignTable)
        .create(new CampaignTable(
            campaign.startDate,
            campaign.endDate,
            campaign.reminderDates,
            campaign.customerEmails,
            campaign.measureValues,
            company))
        .then(campaign => new Campaign(
            campaign.customer_emails,
            campaign.end_date,
            campaign.measure_values,
            campaign.reminder_dates,
            campaign.start_date)
        )
}

export async function updateCampaign(campaign: Campaign, company: string) {
    return getEntityManager(CampaignTable)
        .update(new CampaignTable(
            campaign.startDate,
            campaign.endDate,
            campaign.reminderDates,
            campaign.customerEmails,
            campaign.measureValues,
            company))
        .then(campaign => campaign)
}