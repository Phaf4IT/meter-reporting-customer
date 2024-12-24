"use server"
import {findCampaignByCompanyAndName} from "@/components/admin/campaign/_database/campaignRepository";
import {auth} from "@/auth";
import {findReminderSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";
import {Campaign} from "@/components/admin/campaign/campaign";
import {findCustomerMeasurement} from "@/components/admin/customer-measurement/action/findCustomerMeasurementAction";

export async function findCampaign(token: string | null): Promise<Campaign> {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    const company = session.user.company
    return findReminderSent(token!, session.user.email!, session.user.company)
        .then(async (reminderSent: ReminderSent | undefined) => {
            const customerMeasurement = await findCustomerMeasurement(reminderSent!.campaignName!, reminderSent!.customerEmail!, company);
            if (customerMeasurement) {
                throw Error(`Er is al een stand doorgegeven voor campagne '${reminderSent?.campaignName}' voor gebruiker '${reminderSent?.customerEmail}'`)
            }
            return reminderSent;
        })
        .then((reminderSent: ReminderSent | undefined) =>
            findCampaignByCompanyAndName(reminderSent!.campaignName, company))
        .then(value => value!);
}
