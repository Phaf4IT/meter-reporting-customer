import {Meter} from "@/app/admin/meter/meter";

export async function getMeters(): Promise<Meter[]> {
    const data = await fetch("/api/admin/meter", {
        method: "GET",
        credentials: "include"
    });
    const customers = await data.json();
    return customers.map((customerData: any) => Meter.fromJSON(customerData))
}