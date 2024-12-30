import {NextRequest} from 'next/server';
import {reminderAction} from "@/app/api/cron/reminderAction";

export async function GET(
    request: NextRequest
): Promise<Response> {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    return reminderAction(`${request.nextUrl.protocol}//${request.nextUrl.host}`).then(() => Response.json({success: true}));
}