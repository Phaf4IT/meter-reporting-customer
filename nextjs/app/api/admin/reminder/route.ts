import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {getReminders} from "@/components/admin/reminder/action/getRemindersAction";
import {createReminder} from "@/components/admin/reminder/action/createReminderAction";
import {performReminder} from "@/components/admin/reminder/action/performReminderAction";
import {reminderFromJson} from "@/components/admin/reminder/reminder";
import {removeReminder} from "@/components/admin/reminder/action/deleteReminderAction";

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
        const reminder = reminderFromJson(data);
        return performReminder(reminder, session.user.company, `${request.nextUrl.protocol}//${request.nextUrl.host}`)
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