import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import {customerMeasurementFromJson} from "@/components/admin/customer-measurement/customerMeasurement";
import {report} from "@/app/api/report/reportAction";

export async function POST(
    request: NextRequest
): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    const token = request.nextUrl.searchParams.get('token');
    const data = await request.json();
    return report(customerMeasurementFromJson(data), session.user.company, token!, session.user.email!)
        .then(() => NextResponse.json({}));
}