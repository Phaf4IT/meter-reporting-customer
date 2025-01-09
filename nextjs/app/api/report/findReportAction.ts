import {auth} from "@/auth";
import {findReminderSent} from "@/components/admin/reminder-sent/_database/reminderSentRepository";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";
import {findCustomerMeasurement} from "@/components/admin/customer-measurement/action/findCustomerMeasurementAction";
import {findCampaignByCompanyAndName} from "@/components/admin/campaign/_database/campaignRepository";
import {CustomerMeasurement} from "@/components/report/customerMeasurement";
import {Campaign} from "@/components/report/campaign";
import {Measurements, Report} from "@/app/api/report/report";

export async function findReport(token: string | null): Promise<Report> {
    const session = await auth()
    if (!session) {
        throw new Error('Niet geautoriseerd.');
    }
    return findReminderSent({token: token!, email: session.user.email!})
        .then(async (reminderSentAndCompany: { reminderSent?: ReminderSent, company?: string }) => {
            return Promise.all(
                [findCustomerMeasurement(
                    reminderSentAndCompany.reminderSent!.campaignName!,
                    reminderSentAndCompany.reminderSent!.customerEmail!,
                    reminderSentAndCompany.company!),
                    findCampaignByCompanyAndName(
                        reminderSentAndCompany.reminderSent!.campaignName,
                        reminderSentAndCompany.company!)]
            );
        })
        .then(value => {
            return mapReport(value[0]!, value[1]!);
        })
        .then(value => value!);
}

function mapReport(customerMeasurement: CustomerMeasurement, campaign: Campaign): Report {
    const measurements: Measurements[] = [];
    for (const measureValue of campaign.measureValues) {
        const measurement = customerMeasurement.measurements.find(value => value.name === measureValue.name)!;
        measurements.push({
            name: measurement.name,
            value: measurement.value,
            type: measureValue.type,
            isEditable: measureValue.isEditable,
            defaultValue: measureValue.defaultValue,
            unit: measureValue.unit,
            translations: measureValue.translations,
        })
    }
    return {
        measureValues: measurements,
        dateTime: customerMeasurement.dateTime
    };
}