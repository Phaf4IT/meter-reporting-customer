import {randomUUID} from "node:crypto";

export function getNewCustomerMeasurement() {
    return {
        customerMail: `customer${randomUUID()}@example.com`,
        customerId: `${randomUUID()}`,
        campaignName: `Campaign-${randomUUID()}`,
        measurements: getMeasurement('10', '20'),
        dateTime: new Date().toISOString(),
    };
}

export function getMeasurement(lengthValue: string, widthValue: string) {
    return [
        {name: 'Length', value: lengthValue},
        {name: 'Width', value: widthValue}
    ]
}

export function generateRandomMeasurements(measurements: any[]) {
    return measurements.map(measurement => ({
        name: measurement.name,
        value: getValue(measurement)!
    }));
}

export function getValue(measurement: any) {
    if (measurement.type === 'TEXT') {
        return 'some random text';
    }
    if (measurement.type === 'NUMBER') {
        return '89';
    }
    if (measurement.type === 'BOOLEAN') {
        return 'true';
    }
}

export function getNewCustomerMeasurementByParams({
                                                      customerMail,
                                                      campaignName,
                                                      measurements
                                                  }: CustomerMeasurementFixture) {
    // Als er geen 'measurements' worden meegegeven, gebruiken we de standaard metingen van 'getNewCustomerMeasurement'
    const defaultMeasurement = getNewCustomerMeasurement();

    return {
        ...defaultMeasurement,
        ...(campaignName && {campaignName}),
        ...(customerMail && {customerMail}),
        ...(measurements && {measurements})
    };
}

export interface CustomerMeasurementFixture {
    customerMail?: string,
    campaign?: any,
    campaignName?: string,
    measurements?: { name: string, value: string }[]
}