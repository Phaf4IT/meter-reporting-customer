import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import {getCustomerMeasurements} from "@/components/admin/customer-measurement/action/getCustomerMeasurementsAction";
import {findCustomers} from "@/components/admin/customer/action/findCustomersAction";

// Helper: check of het een base64 data URI is
function isBase64DataUri(value: string): boolean {
    return value.startsWith("data:") && value.includes("base64");
}

// Helper: Escape CSV values
function escapeCsvValue(value: string | number | null | undefined): string {
    if (value === undefined || value === null) return "";
    const str = value.toString().replace(/"/g, '""');
    return `"${str}"`;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await auth();
    if (!session) {
        return new NextResponse("Unauthorized", {status: 401});
    }

    const {searchParams} = new URL(req.url);
    const campaignName = searchParams.get("campaign");
    if (!campaignName) {
        return new NextResponse("Missing campaign name", {status: 400});
    }

    try {
        const measurements = await getCustomerMeasurements(session.user.company);
        const filtered = measurements.filter(m => m.campaignName === campaignName);

        if (filtered.length === 0) {
            return new NextResponse("No measurements found", {status: 404});
        }

        // Verzamel alleen de measurement-namen die géén base64 zijn
        const allMeasurementNames = Array.from(
            new Set(
                filtered.flatMap(m =>
                    m.measurements
                        .filter(measure => typeof measure.value === "string" && !isBase64DataUri(measure.value))
                        .map(measure => measure.name)
                )
            )
        );
        const customerIds = filtered.map(m => m.customerId);
        const customers = await findCustomers(customerIds);

        const customerMap = new Map(customers.map(c => [c.id, c]));
        const allEntityFieldKeys = Array.from(new Set(
            customers.flatMap(c => c.entity ? Object.keys(c.entity.fieldValues || {}) : [])
        ));
        const headers = [
            "Email",
            ...allEntityFieldKeys.map(k => `${k}`),
            "Datum",
            ...allMeasurementNames
        ];
        const csvRows = [headers.map(escapeCsvValue).join(",")];

        for (const m of filtered) {
            const customer = customerMap.get(m.customerId);
            if (!customer) continue;

            const entity = customer.entity;
            const entityFieldValues = entity?.fieldValues || {};

            const valueMap = Object.fromEntries(
                m.measurements
                    .filter(measure => typeof measure.value === "string" && !isBase64DataUri(measure.value))
                    .map(measure => [measure.name, measure.value])
            );


            const row = [
                customer.email,
                ...allEntityFieldKeys.map(key => entityFieldValues[key] || ""),
                new Date(m.dateTime).toISOString(),
                ...allMeasurementNames.map(name => valueMap[name] || "")
            ];

            csvRows.push(row.map(escapeCsvValue).join(","));
        }

        const csvContent = csvRows.join("\n");

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${campaignName}_measurements.csv"`,
            },
        });
    } catch (error) {
        console.error("CSV export error:", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
