import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import {getReminders} from "@/components/admin/reminder/action/getRemindersAction";
import {createReminder} from "@/components/admin/reminder/action/createReminderAction";
import {performReminder} from "@/components/admin/reminder/action/performReminderAction";
import {reminderFromJson} from "@/components/admin/reminder/reminder";
import {removeReminder} from "@/components/admin/reminder/action/deleteReminderAction";
import {isEmpty} from 'lodash';
import {Logger} from "@/lib/logger";
import {NoCampaignFoundError} from "@/components/admin/campaign/_database/campaignRepository";

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
        const reminder = reminderFromJson(data);
        if (isEmpty(reminder.customerIds) || isEmpty(reminder.customerEmails)) {
            return new NextResponse("No customers defined", {status: 400});
        }
        const createdReminder = await createReminder(reminder, session.user.company);
        return NextResponse.json(createdReminder);
    } catch (err: any) {
        if (err instanceof NoCampaignFoundError) {
            return new NextResponse("No correct campaign defined", {status: 400});
        }
        Logger.error("Error creating reminder:", err);
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
    } catch (err: any) {
        Logger.error("Error creating reminder:", err);
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
    } catch (err: any) {
        Logger.error("Error creating reminder:", err);
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
    } catch (err: any) {
        Logger.error("Error creating reminder:", err);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}