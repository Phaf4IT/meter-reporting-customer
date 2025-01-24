import {NextRequest, NextResponse} from 'next/server';
import {auth} from '@/auth'; // Zorg ervoor dat je authentificatie goed werkt
import {createEntity} from '@/components/admin/entity/action/createEntityAction';
import {entityFromJson} from '@/components/admin/entity/entity';
import {updateEntityAction} from '@/components/admin/entity/action/updateEntityAction';
import {removeEntity} from '@/components/admin/entity/action/deleteEntityAction';
import {getEntitiesByType} from "@/components/admin/entity/action/getEntitiesByTypeAction";
import {getEntities} from "@/components/admin/entity/action/getEntitiesAction";

export async function POST(request: NextRequest): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new NextResponse('Unauthorized', {status: 401});
    }
    try {
        const data = await request.json();
        const entity = await createEntity(entityFromJson(data), session.user.company);

        return NextResponse.json(entity);
    } catch (err) {
        console.error('Error creating entity:', err);
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
        const entity = await updateEntityAction(entityFromJson(data), session.user.company);

        return NextResponse.json(entity);
    } catch (err) {
        console.error('Error updating entity:', err);
        return new NextResponse('Internal Server Error', {status: 500});
    }
}

export async function GET(request: NextRequest): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new NextResponse('Unauthorized', {status: 401});
    }
    try {
        // Het ophalen van entiteiten op basis van een entity type
        const entityTypeName = request.nextUrl.searchParams.get("type");
        if (!entityTypeName) {
            const entities = await getEntities(session.user.company);
            return NextResponse.json(entities);
        }

        const entities = await getEntitiesByType(entityTypeName, session.user.company);
        return NextResponse.json(entities);
    } catch (err) {
        console.error('Error fetching entities:', err);
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
        await removeEntity(entityFromJson(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error('Error deleting entity:', err);
        return new NextResponse('Internal Server Error', {status: 500});
    }
}
