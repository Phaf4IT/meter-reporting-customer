import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {createEntityType} from "@/components/admin/entity-type/action/createEntityTypeAction";
import {entityTypeFromJson} from "@/components/admin/entity-type/entityType";
import {deleteEntityType, updateEntityType} from "@/components/admin/entity-type/_database/entityTypeRepository";
import {getEntityTypes} from "@/components/admin/entity-type/action/getEntityTypesAction";

export async function POST(
    request: NextRequest
): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const data = await request.json();
        const entityType = await createEntityType(entityTypeFromJson(data), session.user.company);

        return NextResponse.json(entityType);
    } catch (err) {
        console.error("Error creating entity type:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function PUT(
    request: NextRequest
): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const data = await request.json();
        const entityType = await updateEntityType(entityTypeFromJson(data), session.user.company);

        return NextResponse.json(entityType);
    } catch (err) {
        console.error("Error updating entity type:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function GET(): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const entityTypes = await getEntityTypes(session.user.company);
        return NextResponse.json(entityTypes);
    } catch (err) {
        console.error("Error fetching entity types:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function DELETE(
    request: NextRequest
): Promise<Response> {
    const session = await auth();
    if (!session) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    try {
        const data = await request.json();
        await deleteEntityType(entityTypeFromJson(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error("Error deleting entity type:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
