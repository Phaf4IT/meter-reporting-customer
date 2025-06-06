import {
    deleteCustomerMeasurement,
    findCustomerMeasurementByCompanyCampaignAndCustomerId
} from "@/components/admin/customer-measurement/_database/customerMeasurementRepository";
import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";
import {
    saveCustomerMeasurement as overruleCustomerMeasurement,
} from "@/components/admin/customer-measurement/_database/overruledCustomerMeasurementRepository";
import {
    createCustomerMeasurement
} from "@/components/admin/customer-measurement/action/createCustomerMeasurementAction";

export async function overrideCustomerMeasurement(newCustomerMeasurement: CustomerMeasurement, company: string): Promise<CustomerMeasurement> {
    const originalCustomerMeasurement = await findCustomerMeasurementByCompanyCampaignAndCustomerId(
        newCustomerMeasurement.campaignName, newCustomerMeasurement.customerId, company);
    await overruleCustomerMeasurement(originalCustomerMeasurement!, company);
    await deleteCustomerMeasurement(originalCustomerMeasurement!, company);
    return await createCustomerMeasurement(newCustomerMeasurement, company);
}