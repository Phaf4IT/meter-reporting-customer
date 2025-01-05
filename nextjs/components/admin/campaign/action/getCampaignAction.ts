"use server"
import {findCampaignByCompanyAndName} from "@/components/admin/campaign/_database/campaignRepository";
import {auth} from "@/auth";
import {findReminderSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";
import {Campaign} from "@/components/admin/campaign/campaign";
import {findCustomerMeasurement} from "@/components/admin/customer-measurement/action/findCustomerMeasurementAction";
import {AlreadyReported} from "@/components/admin/campaign/action/alreadyReported";
import {Logger} from "@/lib/logger";

export async function findCampaign(token: string | null): Promise<Campaign> {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findReminderSent(token!, session.user.email!, session.user.company)
        .then(async (reminderSent: ReminderSent | undefined) => {
            if (!reminderSent) {
                throw new Error(`Could not fetch reminder sent for customer ${session.user.email} of company ${session.user.company}`);
            }
            const customerMeasurement = await findCustomerMeasurement(reminderSent!.campaignName!, reminderSent!.customerEmail!, company);
            if (customerMeasurement) {
                throw new AlreadyReported(`Er is al een stand doorgegeven voor campagne '${reminderSent?.campaignName}' voor gebruiker '${reminderSent?.customerEmail}'`)
            }
            return reminderSent;
        })
        .then((reminderSent: ReminderSent | undefined) =>
            findCampaignByCompanyAndName(reminderSent!.campaignName, company))
        .then(value => value!)
        .then(campaign => {
            if (!campaign.customerEmails.some(value => value.toLowerCase() === session.user.email!.toLowerCase())) {
                Logger.error(`User ${session.user.email!} tried to report for campaign ${campaign.name}, but was not found.`);
                throw Error("Invalid data")
            }
            return campaign;
        });
}

