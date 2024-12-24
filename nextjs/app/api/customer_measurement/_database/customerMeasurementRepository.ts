import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {CustomerMeasurementTable} from "@/app/api/customer_measurement/_database/customerMeasurementTable";
import {CustomerMeasurement} from "@/app/api/customer_measurement/customerMeasurement";

export async function findCustomerMeasurementsByCompanyAndCampaign(
    company: string,
    campaignName: string
) {
    return getEntityManager(CustomerMeasurementTable)
        .findBy(CustomerMeasurementTable, {
            company: company,
            campaign_name: campaignName
        })
        .then(measurements => measurements.map(measurement => mapTableToDomain(measurement)));
}

export async function findCustomerMeasurementByCompanyCampaignAndCustomer(
    campaignName: string,
    customerMail: string,
    company: string
) {
    return getEntityManager(CustomerMeasurementTable)
        .findBy(CustomerMeasurementTable, {
            campaign_name: campaignName,
            customer_mail: customerMail,
            company: company
        })
        .then(measurements => measurements.map(measurement => mapTableToDomain(measurement))
            .find(() => true));
}

export async function deleteCustomerMeasurement(measurement: CustomerMeasurement, company: string) {
    return getEntityManager(CustomerMeasurementTable)
        .delete(mapDomainToTable(measurement, company));
}

export async function saveCustomerMeasurement(measurement: CustomerMeasurement, company: string) {
    return getEntityManager(CustomerMeasurementTable)
        .create(mapDomainToTable(measurement, company))
        .then(measurement => mapTableToDomain(measurement));
}

function mapTableToDomain(measurement: CustomerMeasurementTable): CustomerMeasurement {
    return {
        campaignName: measurement.campaignName,
        customerMail: measurement.customerMail,
        measurements: measurement.measurements,
        dateTime: measurement.dateTime,
    }
}

function mapDomainToTable(measurement: CustomerMeasurement,
                          company: string):
    CustomerMeasurementTable {
    return new CustomerMeasurementTable(
        measurement.campaignName,
        measurement.customerMail,
        company,
        measurement.measurements,
        measurement.dateTime
    );
}
