export interface Reminder {
    readonly campaignName: string;
    readonly customerIds: string[];
    readonly customerEmails: string[];
    readonly reminderDate: Date;
}

export function reminderFromJson(json: any): Reminder {
    return {
        campaignName: json.campaignName,
        customerIds: json.customerIds,
        customerEmails: json.customerEmails,
        reminderDate: json.reminderDate,
    }
}