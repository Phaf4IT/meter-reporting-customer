import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {reminderSentFromJson} from "@/app/api/admin/reminder-sent/reminder-sent";
import {createReminderSent} from "@/app/api/admin/reminder-sent/createReminderSentAction";
import {getReminderSents} from "@/app/api/admin/reminder-sent/getReminderSentsAction";
import {removeReminderSent} from "@/app/api/admin/reminder-sent/deleteReminderSentAction";


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
        const reminderSent = await createReminderSent(reminderSentFromJson(data), session.user.company);

        return NextResponse.json(reminderSent);
    } catch (err) {
        console.error("Error creating reminderSent:", err);
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
        return getReminderSents()
            .then(value => NextResponse.json(value));
    } catch (err) {
        console.error("Error creating reminderSent:", err);
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
        await removeReminderSent(reminderSentFromJson(data), session.user.company);

        return NextResponse.json({});
    } catch (err) {
        console.error("Error creating reminderSent:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}