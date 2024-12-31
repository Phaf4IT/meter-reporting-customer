import {
    CustomerMeasurement,
    customerMeasurementFromJson
} from "@/components/admin/customer-measurement/customerMeasurement";
import {ReminderSent} from "@/components/admin/reminder-sent/reminder-sent";

export async function getCustomerMeasurements(): Promise<CustomerMeasurement[]> {
    const response = await fetch("/api/admin/customer-measurement");
    if (!response.ok) {
        throw new Error("Failed to fetch customer measurements");
    }
    const data: CustomerMeasurement[] = await response.json();
    return data;
}

export async function saveCustomerMeasurement(customerMeasurement: CustomerMeasurement, isNew: boolean): Promise<CustomerMeasurement> {
    const response = await fetch("/api/admin/customer-measurement", {
        method: isNew ? "POST" : "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customerMeasurement),
    });

    if (!response.ok) {
        throw new Error("Failed to save customer measurement");
    }

    return customerMeasurementFromJson(await response.json());
}

export async function getRemindersSent() {
    const response = await fetch("/api/admin/reminder-sent");
    if (!response.ok) {
        throw new Error("Failed to fetch customer measurements");
    }
    const data: ReminderSent[] = await response.json();
    return data;
}
