export interface ReminderSent {
    readonly campaignName: string;
    readonly reminderDate: Date;
    readonly customerEmail: string;
    readonly token: string;
}

export function reminderSentFromJson(json: any): ReminderSent {
    return {
        campaignName: json.campaignName,
        customerEmail: json.customerEmail,
        reminderDate: json.reminderDate,
        token: json.token,
    };
}