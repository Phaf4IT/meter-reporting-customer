import {
    findCustomerMeasurementByCompanyCampaignAndCustomer
} from "@/components/admin/customer-measurement/_database/customerMeasurementRepository";

export function findCustomerMeasurement(campaignName: string, email: string, company: string) {
    return findCustomerMeasurementByCompanyCampaignAndCustomer(campaignName, email, company)
}