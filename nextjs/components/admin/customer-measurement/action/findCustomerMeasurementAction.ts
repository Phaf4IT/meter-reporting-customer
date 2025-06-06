import {
    findCustomerMeasurementByCompanyCampaignAndCustomerId
} from "@/components/admin/customer-measurement/_database/customerMeasurementRepository";

export function findCustomerMeasurementByCustomerId(campaignName: string, customerId: string, company: string) {
    return findCustomerMeasurementByCompanyCampaignAndCustomerId(campaignName, customerId, company)
}