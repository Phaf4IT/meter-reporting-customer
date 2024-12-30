import {fromZonedTime, toZonedTime} from "date-fns-tz";
import {startOfDay} from "date-fns";

/**
 * Get date with time and timezone and convert to date with a start of day time and in UTC timezone, keeping same day.
 * @param date
 */
export function getUtcDateAtStartOfDay(date: Date): Date {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = toZonedTime(date, timeZone);
    const startOfDayInTimeZone = startOfDay(zonedDate);
    return fromZonedTime(startOfDayInTimeZone, 'UTC');
}