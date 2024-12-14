import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {getUtcDateAtStartOfDay} from "@/lib/dateUTCConverter";

interface DateRangePickerProps {
    t: (key: string) => string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
}

const DateRangePicker = ({
                             t,
                             startDate,
                             endDate,
                             setStartDate,
                             setEndDate,
                         }: DateRangePickerProps) => {
    const [openEndDate, setOpenEndDate] = useState(false);

    useEffect(() => {
        if (startDate) {
            setOpenEndDate(true);
        }
    }, [startDate]);

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setStartDate(getUtcDateAtStartOfDay(date));
        }
    };

    const handleEndDateChange = (date: Date | null) => {


        if (date) {
            setEndDate(getUtcDateAtStartOfDay(date));
            setOpenEndDate(false);
        }
    };

    const handleEndDateFocus = () => {
        setOpenEndDate(true);
    };

    const getMinEndDate = () => {
        if (startDate) {
            const start = new Date(startDate);
            start.setDate(start.getDate() + 1); 
            return start;
        }
        return new Date();
    };

    return (
        <div className="flex space-x-4">
            <div className="flex-1">
                <label>{t('startDate')}</label>
                <DatePicker
                    selected={startDate ? new Date(startDate) : null}
                    onChange={handleStartDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="bg-cyan-800 w-full p-2"
                    minDate={new Date()}
                />
            </div>

            <div className="flex-1">
                <label>{t('endDate')}</label>
                <DatePicker
                    selected={endDate ? new Date(endDate) : null}
                    onChange={handleEndDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="bg-cyan-800 w-full p-2"
                    open={openEndDate}
                    onCalendarClose={() => setOpenEndDate(false)}
                    onCalendarOpen={() => setOpenEndDate(true)}
                    onFocus={handleEndDateFocus}
                    minDate={getMinEndDate()}
                />
            </div>
        </div>
    );
};

export default DateRangePicker;
