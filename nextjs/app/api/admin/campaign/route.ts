import {NextRequest, NextResponse} from 'next/server';
import {createCampaign} from "@/components/admin/campaign/action/createCampaignAction";
import {auth} from "@/auth";
import {getCampaigns} from "@/components/admin/campaign/action/getCampaignsAction";
import {removeCampaign} from "@/components/admin/campaign/action/deleteCampaignAction";
import {MeasureValue} from "@/components/admin/measure-value/measureValue";

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
        const campaign = await createCampaign(createCampaignFromJson(data), session.user.company);

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
        await removeCampaign(createCampaignFromJson(data), session.user.company);

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

export interface ModifiableCampaign {
    readonly name: string;
    readonly customerIds: string[];
    readonly endDate: Date;
    readonly measureValues: MeasureValue[];
    readonly reminderDates: Date[];
    readonly startDate: Date;
}

function createCampaignFromJson(json: any): ModifiableCampaign {
    return {
        name: json.name,
        customerIds: json.customerIds,
        endDate: new Date(json.endDate),
        measureValues: json.measureValues,
        reminderDates: json.reminderDates.map((date: string) => new Date(date)),
        startDate: new Date(json.startDate),
    }
}