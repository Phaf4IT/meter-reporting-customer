import {findCampaignAndCompanyByReminderSent} from "@/components/admin/campaign/action/getCampaignAction";
import {Campaign} from "@/components/report/campaign";
import {
    createCustomerMeasurement
} from "@/components/admin/customer-measurement/action/createCustomerMeasurementAction";
import {CustomerMeasurement} from "@/components/report/customerMeasurement";
import {Logger} from "@/lib/logger";
import {findCustomerByEmail} from "@/components/admin/customer/_database/customerRepository";
import {findReminderSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";
import {auth} from "@/auth";

export async function report(customerMeasurement: CustomerMeasurement, token: string, email: string): Promise<any> {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    return findReminderSent({token: token!, email: email!})
        .then((reminderSent: { reminderSent?: ReminderSent, company?: string }) => {
            return findCampaignAndCompanyByReminderSent(session, reminderSent);
        })
        .then(async campaignAndCompany => {
            if (!validateCustomerMeasurement(campaignAndCompany.campaign, customerMeasurement)) {
                throw Error("Invalid data")
            }
            const customer = await findCustomerByEmail(email, campaignAndCompany.company);
            return createCustomerMeasurement({
                customerId: customer.id,
                customerMail: email,
                measurements: customerMeasurement.measurements,
                campaignName: campaignAndCompany.campaign.name,
                dateTime: customerMeasurement.dateTime
            }, campaignAndCompany.company)
        });
}

function validateCustomerMeasurement(campaign: Campaign, customerMeasurement: CustomerMeasurement): boolean {
    for (const measureValue of campaign.measureValues) {
        const correspondingMeasurement = customerMeasurement.measurements.find(
            measurement => measurement.name === measureValue.name
        );

        if (!correspondingMeasurement || correspondingMeasurement.value?.trim() === '') {
            Logger.error(`Error during validation of reporting: No value given for ${measureValue.name}`);
            return false;
        }

        const value = correspondingMeasurement.value?.trim();

        // Validatie per type MeasureValue
        switch (measureValue.type) {
            case 'NUMBER':
                if (isNaN(Number(value))) {
                    Logger.error(`Error during validation of reporting: Value for ${measureValue.name} has to be numeric`);
                    return false;
                }
                break;
            case 'BOOLEAN':
                if (value !== 'true' && value !== 'false') {
                    Logger.error(`Error during validation of reporting: Value for ${measureValue.name} has to be a boolean`);
                    return false;
                }
                break;
            case 'PHOTO_UPLOAD':
                if (!value || value.length < 1) {
                    Logger.error(`Error during validation of reporting: Value for ${measureValue.name} has to be a valid file`);
                    return false;
                }
                break;
            case 'TEXT':
                if (!value || value.length < 1) {
                    Logger.error(`Error during validation of reporting: Value for ${measureValue.name} has to be valid text`);
                    return false;
                }
                break;
            default:
                Logger.error(`Error during validation of reporting: Unknown type for ${measureValue.name}`);
                return false;
        }
    }
    return true;
}
