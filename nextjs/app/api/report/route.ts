import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import {customerMeasurementFromJson} from "@/components/admin/customer-measurement/customerMeasurement";
import {report} from "@/app/api/report/reportAction";
import {findReport} from "@/app/api/report/findReportAction";
import {AlreadyReported} from "@/components/admin/campaign/action/alreadyReported";
import {Logger} from "@/lib/logger";

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
    return report(customerMeasurementFromJson(data), token!, session.user.email!)
        .then(() => {
            return new NextResponse(`/success?token=${token}`, {status: 307})
        })
        .catch(reason => {
            if (reason instanceof AlreadyReported) {
                return new NextResponse(`/success?token=${token}`, {status: 307})
            }
            Logger.error("Something went wrong during reporting", reason)
            return new NextResponse("Internal Server Error", {status: 500});
        });
}

export async function GET(request: NextRequest): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    const token = request.nextUrl.searchParams.get('token');
    return findReport(token)
        .then(value => NextResponse.json(value))
}