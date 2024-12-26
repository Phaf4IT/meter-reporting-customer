import {auth} from "@/auth";
import {NextResponse} from "next/server";
import {getCustomerMeasurements} from "@/components/admin/customer-measurement/action/getCustomerMeasurementsAction";

export async function GET(): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        return getCustomerMeasurements(session.user.company)
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating measureValue:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}