import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import {findCampaign} from "@/app/api/campaign/getCampaignAction";

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
    findCampaign(token)
        .then(campaign => {
            // TODO with campaign
            console.log(campaign);
        })
    return NextResponse.json({});
}