import {NextRequest, NextResponse} from 'next/server';
import {createCampaign} from "@/app/api/admin/campaign/createCampaignAction";
import {auth} from "@/auth";
import {getCampaigns} from "@/app/api/admin/campaign/getCampaignsAction";
import {campaignFromJson} from "@/app/admin/campaign/campaign";
import {removeCampaign} from "@/app/api/admin/campaign/deleteCampaignAction";

export async function POST(
    request: NextRequest
): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const data = await request.json();
        const campaign = await createCampaign(campaignFromJson(data), session.user.company);

        return NextResponse.json(campaign);
    } catch (err) {
        console.error("Error creating campaign:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function DELETE(
    request: NextRequest
): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const data = await request.json();
        await removeCampaign(campaignFromJson(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error("Error creating campaign:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function GET(): Promise<Response> {
    const session = await auth()
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        return getCampaigns()
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating campaign:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

