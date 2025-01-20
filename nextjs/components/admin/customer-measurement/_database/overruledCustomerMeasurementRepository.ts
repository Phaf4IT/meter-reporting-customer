import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {
    OverruledCustomerMeasurementTable
} from "@/components/admin/customer-measurement/_database/overruledCustomerMeasurementTable";
import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";

export async function findCustomerMeasurementsByCompanyAndCampaign(
    company: string,
    campaignName: string
) {
    return getEntityManager(OverruledCustomerMeasurementTable)
        .findBy({
            company: company,
            campaign_name: campaignName
        })
        .then(measurements => measurements.map(measurement => mapTableToDomain(measurement)));
}

export async function deleteCustomerMeasurement(measurement: CustomerMeasurement, company: string) {
    return getEntityManager(OverruledCustomerMeasurementTable)
        .delete(mapDomainToTable(measurement, company));
}

export async function saveCustomerMeasurement(measurement: CustomerMeasurement, company: string) {
    return getEntityManager(OverruledCustomerMeasurementTable)
        .create(mapDomainToTable(measurement, company))
        .then(measurement => mapTableToDomain(measurement));
}

function mapTableToDomain(measurement: OverruledCustomerMeasurementTable): CustomerMeasurement {
    return {
        campaignName: measurement.campaignName,
        customerId: measurement.customerId,
        customerMail: measurement.customerMail,
        measurements: measurement.measurements,
        dateTime: measurement.originalDateTime,
    }
}

function mapDomainToTable(measurement: CustomerMeasurement,
                          company: string):
    OverruledCustomerMeasurementTable {
    return OverruledCustomerMeasurementTable.of(
        {
            campaignName: measurement.campaignName,
            customerId: measurement.customerId,
            customerMail: measurement.customerMail,
            company,
            measurements: measurement.measurements,
            originalDateTime: measurement.dateTime,
            overruleDateTime: new Date()
        }
    );
}
