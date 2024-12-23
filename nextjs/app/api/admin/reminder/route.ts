import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {getReminders} from "@/app/api/admin/reminder/getRemindersAction";
import {createReminder} from "@/app/api/admin/reminder/createReminderAction";
import {performReminder} from "@/app/api/admin/reminder/performReminderAction";
import {reminderFromJson} from "@/app/api/admin/reminder/reminder";
import {genericReminderFromJson} from "@/app/api/admin/reminder/findExpiredRemindersAction";
import {removeReminder} from "@/app/api/admin/reminder/deleteReminderAction";

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
        const reminder = await createReminder(reminderFromJson(data), session.user.company);

        return NextResponse.json(reminder);
    } catch (err) {
        console.error("Error creating reminder:", err);
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
        return performReminder(genericReminderFromJson(data, session.user.company), `${request.nextUrl.protocol}//${request.nextUrl.host}`)
            .then(() => NextResponse.json({}));
    } catch (err) {
        console.error("Error creating reminder:", err);
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
        return getReminders()
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating reminder:", err);
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
        await removeReminder(reminderFromJson(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error("Error creating reminder:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}