import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";
import {findCampaignAndCompany} from "@/components/admin/campaign/action/getCampaignAction";
import {campaignFromCampaignAndMeasurement} from "@/components/report/campaign";
import {AlreadyReported} from "@/components/admin/campaign/action/alreadyReported";
import {Logger} from "@/lib/logger";

export async function GET(req: NextRequest): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    const token = req.nextUrl.searchParams.get('token');
    try {
        const {campaign, previousMeasurements} = await findCampaignAndCompany(token);
        return NextResponse.json(campaignFromCampaignAndMeasurement(campaign, previousMeasurements));
    } catch (err) {
        if (err instanceof AlreadyReported) {
            return new NextResponse(`/success?token=${token}`, {status: 307})
        }
        Logger.error(`Could not get campaign`, err instanceof Error ? err : undefined)
        return new NextResponse("Internal Server Error", {status: 500});
    }
}