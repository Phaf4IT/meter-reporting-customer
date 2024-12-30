import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";
import {findCampaign} from "@/components/admin/campaign/action/getCampaignAction";
import {campaignFromJson} from "@/components/report/campaign";
import {AlreadyReported} from "@/components/admin/campaign/action/alreadyReported";
import { Logger } from "@/lib/logger";

export async function GET(req: NextRequest): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const token = req.nextUrl.searchParams.get('token');
        return findCampaign(token)
            .then(value => NextResponse.json(campaignFromJson(value)))
            .catch(reason => {
                if (reason instanceof AlreadyReported) {
                    return new NextResponse(`/success?token=${token}`, {status: 307})
                }
                Logger.error(`Could not get campaign`, reason)
                return new NextResponse("Internal Server Error", {status: 500});
            });
    } catch (err) {
        console.error("Error creating campaign:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}