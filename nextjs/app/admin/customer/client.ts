'use client';
import {Customer, customerFromJson} from "@/components/admin/customer/customer";
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";

export async function getCustomers(): Promise<Customer[]> {
    const data = await fetch("/api/admin/customer", {
        method: "GET",
        credentials: "include"
    });
    const customers = await data.json();
    return customers.map((customerData: any) => customerFromJson(customerData))
}

export async function getNonActiveCustomers(): Promise<Customer[]> {
    const data = await fetch("/api/admin/non-active-customer", {
        method: "GET",
        credentials: "include"
    });
    const customers = await data.json();
    return customers.map((customerData: any) => customerFromJson(customerData))
}

export async function getCustomersByEntityIds(entityIds: string[]): Promise<Customer[]> {
    const data = await fetch(`/api/admin/customer?${entityIds.map(id => `entityIds=${id}`).join("&")}`, {
        method: "GET",
        credentials: "include"
    });
    const customers = await data.json();
    return customers.map((customerData: any) => customerFromJson(customerData))
}

export async function saveCustomer(customer: ModifiableCustomer, isNew: boolean): Promise<Customer> {
    const response = await fetch("/api/admin/customer", {
        method: isNew ? "POST" : "PUT",
        body: JSON.stringify(customer),
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const newCustomer = await response.json();
    return customerFromJson(newCustomer);
}

export async function deleteCustomer(customer: ModifiableCustomer): Promise<Response> {
    const response = await fetch("/api/admin/customer", {
        method: "DELETE",
        body: JSON.stringify(customer),
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response;
}