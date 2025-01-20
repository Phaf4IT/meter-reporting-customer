export interface ReminderSent {
    readonly campaignName: string;
    readonly reminderDate: Date;
    readonly customerId: string;
    readonly customerEmail: string;
    readonly token: string;
}

export function reminderSentFromJson(json: any): ReminderSent {
    return {
        campaignName: json.campaignName,
        customerId: json.customerId,
        customerEmail: json.customerEmail,
        reminderDate: json.reminderDate,
        token: json.token,
    };
}