import {NextRequest, NextResponse} from 'next/server';
import {auth} from '@/auth'; // Zorg ervoor dat je authenticatie goed werkt
import {tariffFromJson} from '@/components/admin/tariff/tariff';
import {createTariff} from "@/components/admin/tariff/action/createTariffAction";
import {getTariffsByCompany} from "@/components/admin/tariff/action/getTariffsByCompany";
import {removeTariff} from "@/components/admin/tariff/action/removeTariff";
import {getTariffByCampaignAndCompany} from "@/components/admin/tariff/action/getTariffByCampaignAndCompany";
import {updateTariffAction} from "@/components/admin/tariff/action/updateTariffAction";

export async function POST(request: NextRequest): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new NextResponse('Unauthorized', {status: 401});
    }

    try {
        const data = await request.json();
        const tariff = await createTariff(tariffFromJson(data), session.user.company);

        return NextResponse.json(tariff);
    } catch (err) {
        console.error('Error creating tariff:', err);
        return new NextResponse('Internal Server Error', {status: 500});
    }
}

export async function PUT(request: NextRequest): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new NextResponse('Unauthorized', {status: 401});
    }

    try {
        const data = await request.json();
        const tariff = await updateTariffAction(tariffFromJson(data), session.user.company);

        return NextResponse.json(tariff);
    } catch (err) {
        console.error('Error updating tariff:', err);
        return new NextResponse('Internal Server Error', {status: 500});
    }
}

export async function GET(request: NextRequest): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new NextResponse('Unauthorized', {status: 401});
    }

    try {
        const campaignName = request.nextUrl.searchParams.get("campaign");
        const company = session.user.company;

        if (campaignName) {
            // Haal specifieke tariff op gebaseerd op campaignName en company
            const tariff = await getTariffByCampaignAndCompany(campaignName, company);
            if (tariff) {
                return NextResponse.json(tariff);
            } else {
                return new NextResponse('Tariff not found', {status: 404});
            }
        }

        // Haal alle tariffs op voor het bedrijf
        const tariffs = await getTariffsByCompany(company);
        return NextResponse.json(tariffs);
    } catch (err) {
        console.error('Error fetching tariffs:', err);
        return new NextResponse('Internal Server Error', {status: 500});
    }
}

export async function DELETE(request: NextRequest): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new NextResponse('Unauthorized', {status: 401});
    }

    try {
        const data = await request.json();
        await removeTariff(tariffFromJson(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error('Error deleting tariff:', err);
        return new NextResponse('Internal Server Error', {status: 500});
    }
}
