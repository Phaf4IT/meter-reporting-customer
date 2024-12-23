import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";
import {findCampaign} from "@/app/api/campaign/getCampaignAction";

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
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating campaign:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}