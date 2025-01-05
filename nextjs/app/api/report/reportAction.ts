import {findCampaign} from "@/components/admin/campaign/action/getCampaignAction";
import {Campaign} from "@/components/report/campaign";
import {
    createCustomerMeasurement
} from "@/components/admin/customer-measurement/action/createCustomerMeasurementAction";
import {CustomerMeasurement} from "@/app/report/customerMeasurement";
import {findCustomerMeasurement} from "@/components/admin/customer-measurement/action/findCustomerMeasurementAction";
import {Logger} from "@/lib/logger";

export async function report(customerMeasurement: CustomerMeasurement, company: string, token: string, email: string): Promise<any> {
    return findCampaign(token)
        .then(async campaign => {
            const measurement = await findCustomerMeasurement(campaign.name, email, company)
            if (measurement != undefined) {
                throw Error("Already measured")
            }
            if (!validateCustomerMeasurement(campaign, customerMeasurement)) {
                throw Error("Invalid data")
            }
            return createCustomerMeasurement({
                customerMail: email,
                measurements: customerMeasurement.measurements,
                campaignName: campaign.name,
                dateTime: customerMeasurement.dateTime
            }, company)
        });
}

function validateCustomerMeasurement(campaign: Campaign, customerMeasurement: CustomerMeasurement): boolean {
    for (const measureValue of campaign.measureValues) {
        const correspondingMeasurement = customerMeasurement.measurements.find(
            measurement => measurement.name === measureValue.name
        );

        if (!correspondingMeasurement || correspondingMeasurement.value.trim() === '') {
            Logger.error(`Fout: Geen waarde opgegeven voor ${measureValue.name}`);
            return false;
        }

        const value = correspondingMeasurement.value.trim();

        // Validatie per type MeasureValue
        switch (measureValue.type) {
            case 'NUMBER':
                if (isNaN(Number(value))) {
                    Logger.error(`Fout: Waarde voor ${measureValue.name} moet een nummer zijn`);
                    return false;
                }
                break;
            case 'BOOLEAN':
                if (value !== 'true' && value !== 'false') {
                    Logger.error(`Fout: Waarde voor ${measureValue.name} moet 'true' of 'false' zijn`);
                    return false;
                }
                break;
            case 'TEXT':
                if (value.length < 1) {
                    Logger.error(`Fout: Waarde voor ${measureValue.name} moet een geldige tekst zijn`);
                    return false;
                }
                break;
            default:
                Logger.error(`Onbekend type voor ${measureValue.name}`);
                return false;
        }
    }
    return true;
}