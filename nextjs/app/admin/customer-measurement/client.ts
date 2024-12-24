import {CustomerMeasurement} from "@/components/admin/customer-measurement/customerMeasurement";

export async function getCustomerMeasurements(): Promise<CustomerMeasurement[]> {
    const response = await fetch("/api/admin/customer-measurements");
    if (!response.ok) {
        throw new Error("Failed to fetch customer measurements");
    }
    const data: CustomerMeasurement[] = await response.json();
    return data;
}

// Sla een klantmeting op (bijv. overruled of nieuw)
export async function saveCustomerMeasurement(customerMeasurement: CustomerMeasurement, isNew: boolean): Promise<CustomerMeasurement> {
    const response = await fetch("/api/admin/customer-measurements", {
        method: isNew ? "POST" : "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customerMeasurement),
    });

    if (!response.ok) {
        throw new Error("Failed to save customer measurement");
    }

    const data: CustomerMeasurement = await response.json();
    return data;
}
