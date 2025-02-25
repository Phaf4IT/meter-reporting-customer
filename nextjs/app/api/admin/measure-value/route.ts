import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {getMeasureValues} from "@/components/admin/measure-value/action/getMeasureValuesAction";
import {createMeasureValue} from "@/components/admin/measure-value/action/createMeasureValueAction";
import {measureValueFromJson} from "@/components/admin/measure-value/measureValue";
import {updateMeasureValue} from "@/components/admin/measure-value/action/updateMeasureValueAction";
import {deleteMeasureValue} from "@/components/admin/measure-value/action/deleteMeasureValueAction";

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
        const measureValue = await createMeasureValue(measureValueFromJson(data), session.user.company);

        return NextResponse.json(measureValue);
    } catch (err) {
        console.error("Error creating measureValue:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function PUT(
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
        const measureValue = await updateMeasureValue(measureValueFromJson(data), session.user.company);

        return NextResponse.json(measureValue);
    } catch (err) {
        console.error("Error creating measureValue:", err);
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
        return getMeasureValues()
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating measureValue:", err);
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
        await deleteMeasureValue(measureValueFromJson(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error("Error creating measureValue:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}