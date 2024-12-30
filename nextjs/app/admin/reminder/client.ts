import {Reminder, reminderFromJson} from "@/components/admin/reminder/reminder";

export async function getReminders(): Promise<Reminder[]> {
    const data = await fetch("/api/admin/reminder", {
        method: "GET",
        credentials: "include"
    });
    const reminders = await data.json();
    return reminders.map((json: any) => reminderFromJson(json))
}

export async function sendReminder(reminder: Reminder): Promise<Response> {
    return await fetch("/api/admin/reminder", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(reminder)
    });
}

export async function deleteReminder(reminder: Reminder): Promise<Response> {
    const response = await fetch("/api/admin/reminder", {
        method: "DELETE",
        body: JSON.stringify(reminder),
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response;
}