"use server"
import {findCampaignByCompanyAndName} from "@/components/admin/campaign/_database/campaignRepository";
import {auth} from "@/auth";
import {findReminderSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";
import {Campaign} from "@/components/admin/campaign/campaign";
import {findCustomerMeasurement} from "@/components/admin/customer-measurement/action/findCustomerMeasurementAction";
import {AlreadyReported} from "@/components/admin/campaign/action/alreadyReported";
import {Logger} from "@/lib/logger";

export async function findCampaignAndCompany(token: string | null): Promise<{ campaign: Campaign, company: string }> {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    return findReminderSent({token: token!, email: session.user.email!})
        .then(async (reminderSentAndCompany: { reminderSent?: ReminderSent, company?: string }) => {
            if (!reminderSentAndCompany.reminderSent) {
                throw new Error(`Could not fetch reminder sent for customer ${session.user.email} of company ${session.user.company}`);
            }
            const customerMeasurement = await findCustomerMeasurement(reminderSentAndCompany.reminderSent!.campaignName!, reminderSentAndCompany.reminderSent!.customerEmail!, reminderSentAndCompany.company!);
            if (customerMeasurement) {
                throw new AlreadyReported(`Er is al een stand doorgegeven voor campagne '${reminderSentAndCompany.reminderSent?.campaignName}' voor gebruiker '${reminderSentAndCompany.reminderSent?.customerEmail}'`)
            }
            return reminderSentAndCompany;
        })
        .then((reminderSentAndCompany: { reminderSent?: ReminderSent, company?: string }) =>
            findCampaignByCompanyAndName(reminderSentAndCompany.reminderSent!.campaignName, reminderSentAndCompany.company!)
                .then(value => value!)
                .then(campaign => {
                    if (!campaign.customerEmails.some(value => value.toLowerCase() === session.user.email!.toLowerCase())) {
                        Logger.error(`User ${session.user.email!} tried to report for campaign ${campaign.name}, but was not found.`);
                        throw Error("Invalid data")
                    }
                    return {campaign, company: reminderSentAndCompany.company!};
                }));
}

