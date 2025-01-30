import {
    CustomerMeasurementFixture,
    generateRandomMeasurements,
    getNewCustomerMeasurementByParams
} from "@/testlib/fixtures/customer-measurement.fixture";

export async function createCustomerMeasurement(request: any, sessionCookie: string, customerMeasurementFixture: CustomerMeasurementFixture) {
    const customerMeasurement = getNewCustomerMeasurementByParams({
        customerMail: customerMeasurementFixture.customerMail,
        campaignName: customerMeasurementFixture.campaign.name,
        measurements: customerMeasurementFixture.measurements ? customerMeasurementFixture.measurements : generateRandomMeasurements(customerMeasurementFixture.campaignConfiguration.measureValues)
    });
    await request.post('/api/admin/customer-measurement')
        .send(customerMeasurement)
        .set('Cookie', sessionCookie);
    return customerMeasurement;
}