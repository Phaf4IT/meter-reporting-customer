import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {campaignConfigurationFromJson} from "@/components/admin/campaign-configuration/campaignConfiguration";
import {
    createCampaignConfiguration
} from "@/components/admin/campaign-configuration/action/createCampaignConfigurationAction";
import {
    removeCampaignConfiguration
} from "@/components/admin/campaign-configuration/action/deleteCampaignConfigurationAction";
import {
    getCampaignConfigurations
} from "@/components/admin/campaign-configuration/action/getCampaignConfigurationsAction";

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
        const campaign = await createCampaignConfiguration(campaignConfigurationFromJson(data), session.user.company);

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
        await removeCampaignConfiguration(campaignConfigurationFromJson(data), session.user.company);

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
        return getCampaignConfigurations()
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating campaign:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
