import {
    findCustomerMeasurementsByCompany
} from "@/components/admin/customer-measurement/_database/customerMeasurementRepository";

export function getCustomerMeasurements(company: string) {
    return findCustomerMeasurementsByCompany(company);
}