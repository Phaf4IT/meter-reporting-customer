import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ReminderDatesProps {
    t: (key: string) => string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    reminderDates: Date[];
    setReminderDates: (dates: Date[]) => void;
}

const ReminderDates = ({
                           t,
                           startDate,
                           endDate,
                           reminderDates,
                           setReminderDates,
                       }: ReminderDatesProps) => {
    const [reminderCount, setReminderCount] = useState<number>(5); 

    useEffect(() => {
        if (startDate && endDate && reminderCount > 0) {
            const reminders = getReminderDates(endDate, startDate);
            setReminderDates(reminders);
        }

        function getReminderDates(end: Date, start: Date): Date[] {
            if (reminderCount === 1) {
                const middle = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2);
                return [middle];
            }

            const totalDays = (end.getTime() - start.getTime()) / getMillisToDays(); 
            const interval = totalDays / (reminderCount - 1); 

            const reminders: Date[] = [];
            for (let reminderIndex = 0; reminderIndex < reminderCount; reminderIndex++) {
                const reminderDate = new Date(start.getTime() + reminderIndex * interval * getMillisToDays() + 12 * 60 * 60 * 1000);
                reminders.push(reminderDate);
            }
            return reminders;
        }
    }, [startDate, endDate, reminderCount, setReminderDates]);


    const handleDateChange = (index: number, newDate: Date | null) => {
        if (newDate) {
            const updatedDates = [...reminderDates];
            updatedDates[index] = newDate;
            setReminderDates(updatedDates);
        }
    };

    function getMillisToDays() {
        return 24 * 60 * 60 * 1000;
    }

    const handleRemoveDate = (index: number) => {
        const updatedDates = reminderDates.filter((_, i) => i !== index);
        setReminderDates(updatedDates);
    };

    const handleAddDate = () => {
        setReminderDates([...reminderDates, endDate ? endDate : new Date()]); 
    };

    return (
        <div className="space-y-4">
            <label className="block text-lg font-semibold">{t("reminderDates")}</label>
            <div className="flex items-center space-x-4">
                <input
                    type="number"
                    className="bg-cyan-800 text-white px-4 py-2 rounded w-full"
                    placeholder={t("repeatValue")}
                    value={reminderCount}
                    onChange={(e) => setReminderCount(Math.max(1, +e.target.value))} 
                />
            </div>
            <ul className="space-y-2">
                {reminderDates.map((date, idx) => (
                    <li key={idx} className="flex items-center space-x-4">
                        <DatePicker
                            selected={date ? new Date(date) : null}
                            onChange={(date: Date | null) => handleDateChange(idx, date)}
                            dateFormat="yyyy-MM-dd HH:mm" 
                            showTimeSelect 
                            timeFormat="HH:mm" 
                            timeIntervals={15} 
                            className="bg-cyan-800 text-white px-4 py-2 rounded"
                            minDate={startDate ? new Date(startDate) : new Date()}
                            maxDate={endDate ? new Date(endDate) : undefined}
                            placeholderText={t("selectDate")}
                        />
                        <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => handleRemoveDate(idx)}
                        >
                            {t("remove")}
                        </button>
                    </li>
                ))}
            </ul>
            <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddDate}
            >
                {t("addDate")}
            </button>
        </div>
    );
};

export default ReminderDates;
