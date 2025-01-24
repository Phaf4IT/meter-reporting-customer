import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {reminderSentFromJson} from "@/components/admin/reminder-sent/reminder-sent";
import {createReminderSent} from "@/components/admin/reminder-sent/action/createReminderSentAction";
import {getReminderSents} from "@/components/admin/reminder-sent/action/getReminderSentsAction";
import {removeReminderSent} from "@/components/admin/reminder-sent/action/deleteReminderSentAction";
import {Logger} from "@/lib/logger";


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
    } catch (err: any) {
        Logger.error("Error creating reminderSent:", err);
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
    } catch (err: any) {
        Logger.error("Error creating reminderSent:", err);
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
    } catch (err: any) {
        Logger.error("Error creating reminderSent:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}