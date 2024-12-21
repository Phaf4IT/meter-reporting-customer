import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {getMeasureValues} from "@/app/api/admin/measure-value/getMeasureValuesAction";
import {createMeasureValue} from "@/app/api/admin/measure-value/createMeasureValueAction";
import {MeasureValue} from "@/app/admin/measure-value/measureValue";
import {updateMeasureValue} from "@/app/api/admin/measure-value/updateMeasureValueAction";
import {deleteMeasureValue} from "@/app/api/admin/measure-value/deleteMeasureValueAction";

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
        const measureValue = await createMeasureValue(MeasureValue.fromJSON(data), session.user.company);

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
        const measureValue = await updateMeasureValue(MeasureValue.fromJSON(data), session.user.company);

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
        await deleteMeasureValue(MeasureValue.fromJSON(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error("Error creating measureValue:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}