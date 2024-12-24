import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";
import {saveCustomerMeasurement} from "@/components/admin/customer-measurement/_database/customerMeasurementRepository";

export function createCustomerMeasurement(customerMeasurement: CustomerMeasurement,
                                          company: string) {
    return saveCustomerMeasurement(customerMeasurement, company);
}