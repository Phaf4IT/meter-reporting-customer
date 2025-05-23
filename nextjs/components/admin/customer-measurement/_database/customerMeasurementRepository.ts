import {getEntityManager} from "@/lib/jpa/entity-fetcher";
import {CustomerMeasurementTable} from "@/components/admin/customer-measurement/_database/customerMeasurementTable";
import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";

export async function findCustomerMeasurementsByCompanyAndCampaign(
    company: string,
    campaignName: string
) {
    return getEntityManager(CustomerMeasurementTable)
        .findBy({
            company: company,
            campaign_name: campaignName
        })
        .then(measurements => measurements.map(measurement => mapTableToDomain(measurement)));
}

export async function findCustomerMeasurementsByCompany(
    company: string
) {
    return getEntityManager(CustomerMeasurementTable)
        .findBy({
            company: company,
        })
        .then(measurements => measurements.map(measurement => mapTableToDomain(measurement)));
}

export async function findCustomerMeasurementByCompanyCampaignAndCustomer(
    campaignName: string,
    customerMail: string,
    company: string
) {
    return getEntityManager(CustomerMeasurementTable)
        .findBy({
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
        customerId: measurement.customerId,
        customerMail: measurement.customerMail,
        measurements: measurement.measurements,
        dateTime: measurement.dateTime,
    }
}

function mapDomainToTable(measurement: CustomerMeasurement,
                          company: string):
    CustomerMeasurementTable {
    return CustomerMeasurementTable.of(
        {
            campaignName: measurement.campaignName,
            customerId: measurement.customerId,
            customerMail: measurement.customerMail,
            company,
            measurements: measurement.measurements,
            dateTime: measurement.dateTime
        }
    );
}
