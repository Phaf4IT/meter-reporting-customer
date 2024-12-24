import {CustomerMeasurement} from "@/app/api/customer_measurement/customerMeasurement";
import {saveCustomerMeasurement} from "@/app/api/customer_measurement/_database/customerMeasurementRepository";

export function createCustomerMeasurement(customerMeasurement: CustomerMeasurement,
                                          company: string) {
    return saveCustomerMeasurement(customerMeasurement, company);
}