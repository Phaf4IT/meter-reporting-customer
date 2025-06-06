"use server"
import {findCampaignByCompanyAndName} from "@/components/admin/campaign/_database/campaignRepository";
import {auth} from "@/auth";
import {findReminderSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";
import {Campaign} from "@/components/admin/campaign/campaign";
import {
    findCustomerMeasurementByCustomerId
} from "@/components/admin/customer-measurement/action/findCustomerMeasurementAction";
import {AlreadyReported} from "@/components/admin/campaign/action/alreadyReported";
import {Logger} from "@/lib/logger";
import {
    findLastCustomerMeasurementByCompanyAndCustomer
} from "@/components/admin/customer-measurement/_database/customerMeasurementRepository";
import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";

export async function findCampaignAndCompany(token: string | null): Promise<{
    campaign: Campaign,
    company: string,
    previousMeasurements?: CustomerMeasurement
}> {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    return findReminderSent({token: token!, email: session.user.email!})
        .then(async (reminderSentAndCompany: { reminderSent?: ReminderSent, company?: string }) => {
            return findCampaignAndCompanyByReminderSent(session, reminderSentAndCompany);
        });
}

export async function findCampaignAndCompanyByReminderSent(session: any, reminderSentAndCompany: {
    reminderSent?: ReminderSent,
    company?: string
}): Promise<{
    campaign: Campaign,
    company: string,
    previousMeasurements?: CustomerMeasurement
}> {
    if (!reminderSentAndCompany.reminderSent) {
        throw new Error(`Could not fetch reminder sent for customer ${session.user.email} of company ${session.user.company}`);
    }
    return findCustomerMeasurementByCustomerId(reminderSentAndCompany.reminderSent!.campaignName!, reminderSentAndCompany.reminderSent!.customerId!, reminderSentAndCompany.company!)
        .then(async (customerMeasurement) => {
            if (customerMeasurement) {
                throw new AlreadyReported(`Er is al een stand doorgegeven voor campagne '${reminderSentAndCompany.reminderSent?.campaignName}' voor gebruiker '${reminderSentAndCompany.reminderSent?.customerEmail}'`)
            }
            return reminderSentAndCompany;
        })
        .then(async (reminderSentAndCompany: { reminderSent?: ReminderSent, company?: string }) => {
            const value = await findCampaignByCompanyAndName(reminderSentAndCompany.reminderSent!.campaignName, reminderSentAndCompany.company!);
            const campaign = value!;
            if (!campaign.customers.some(value_1 => value_1.email.toLowerCase() === session.user.email!.toLowerCase())) {
                Logger.error(`User ${session.user.email!} tried to report for campaign ${campaign.name}, but was not found.`);
                throw Error("Invalid data");
            }
            return {
                campaign,
                reminderSent: reminderSentAndCompany.reminderSent!,
                company: reminderSentAndCompany.company!
            };
        })
        .then(async ({company, reminderSent, campaign}: {
            campaign: Campaign,
            reminderSent?: ReminderSent,
            company: string
        }) => {
            const measurements = await findLastCustomerMeasurementByCompanyAndCustomer(reminderSent!.customerId!, company!);
            return {
                campaign,
                company,
                previousMeasurements: measurements
            }
        });
}