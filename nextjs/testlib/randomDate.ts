export function randomDate(): string {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 3000);
    now.setDate(now.getDate() + randomDays);
    return now.toISOString();
}