// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.campaign_reminder_sent */
export type Campaign_reminder_sentCampaign_name = string;

/** Identifier type for public.campaign_reminder_sent */
export type Campaign_reminder_sentReminder_date = Date;

/** Identifier type for public.campaign_reminder_sent */
export type Campaign_reminder_sentCustomer_email = string;

/** Identifier type for public.campaign_reminder_sent */
export type Campaign_reminder_sentCompany = string;

/** Represents the table public.campaign_reminder_sent */
export default interface CampaignReminderSent {
    campaignName: Campaign_reminder_sentCampaign_name;

    reminderDate: Campaign_reminder_sentReminder_date;

    customerEmail: Campaign_reminder_sentCustomer_email;

    company: Campaign_reminder_sentCompany;

    customerId: string;

    token: string;
}

/** Represents the initializer for the table public.campaign_reminder_sent */
export interface CampaignReminderSentInitializer {
    campaignName: Campaign_reminder_sentCampaign_name;

    reminderDate: Campaign_reminder_sentReminder_date;

    customerEmail: Campaign_reminder_sentCustomer_email;

    company: Campaign_reminder_sentCompany;

    customerId: string;

    token: string;
}

/** Represents the mutator for the table public.campaign_reminder_sent */
export interface CampaignReminderSentMutator {
    campaignName?: Campaign_reminder_sentCampaign_name;

    reminderDate?: Campaign_reminder_sentReminder_date;

    customerEmail?: Campaign_reminder_sentCustomer_email;

    company?: Campaign_reminder_sentCompany;

    customerId?: string;

    token?: string;
}
