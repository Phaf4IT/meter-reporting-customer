import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";
import {getCustomerMeasurements} from "@/components/admin/customer-measurement/action/getCustomerMeasurementsAction";
import {
    createCustomerMeasurement
} from "@/components/admin/customer-measurement/action/createCustomerMeasurementAction";
import {
    CustomerMeasurement,
    customerMeasurementFromJson
} from "@/components/admin/customer-measurement/customerMeasurement";
import {
    overrideCustomerMeasurement
} from "@/components/admin/customer-measurement/action/overruleCustomerMeasurementAction";

export async function GET(): Promise<NextResponse> {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    try {
        return getCustomerMeasurements(session.user.company)
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating measureValue:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    try {
        const data = customerMeasurementFromJson(await request.json());
        return createCustomerMeasurement({
            customerId: data.customerId,
            customerMail: data.customerMail,
            measurements: data.measurements,
            campaignName: data.campaignName,
            dateTime: data.dateTime
        }, session.user.company)
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating measureValue:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    try {
        const data = customerMeasurementFromJson(await request.json());
        return overrideCustomerMeasurement({
            customerId: data.customerId,
            customerMail: data.customerMail,
            measurements: data.measurements,
            campaignName: data.campaignName,
            dateTime: data.dateTime
        }, session.user.company)
            .then((value: CustomerMeasurement) => {
                return NextResponse.json(value);
            });
    } catch (err) {
        console.error("Error creating measureValue:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}