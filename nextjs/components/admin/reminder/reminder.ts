export interface Reminder {
    readonly campaignName: string;
    readonly customerEmails: string[];
    readonly reminderDate: Date;
}

export function reminderFromJson(json: any): Reminder {
    return {
        campaignName: json.campaignName,
        customerEmails: json.customerEmails,
        reminderDate: json.reminderDate,
    }
}