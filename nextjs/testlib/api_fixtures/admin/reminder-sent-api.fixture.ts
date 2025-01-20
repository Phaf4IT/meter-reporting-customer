import {getNewReminderSentByParams} from "@/testlib/fixtures/reminder-sent.fixture";

export async function createReminderSent(request: any, sessionCookie: string, {campaign, customer}: {
    campaign: any,
    customer: any
}) {
    const reminderSent = getNewReminderSentByParams({campaignName: campaign.name, customerEmail: customer.email});
    await request.post('/api/admin/reminder-sent')
        .send(reminderSent)
        .set('Cookie', sessionCookie);
    return reminderSent;
}