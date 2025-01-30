import React, {useEffect, useState} from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import {getUtcDateAtStartOfDay} from "@/lib/dateUTCConverter";
import {LooseValue} from "@/node_modules/@wojtekmaj/react-daterange-picker/dist/esm/shared/types";
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import '../custom-calendar.scss'

interface DateRangePickerProps {
    t: (key: string) => string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
    minDate: Date | undefined;
}

const DateRangePickerComponent = ({
                                      t,
                                      startDate,
                                      endDate,
                                      setStartDate,
                                      setEndDate,
                                      minDate,
                                  }: DateRangePickerProps) => {
    const [range, setRange] = useState<LooseValue>(startDate && endDate ? [startDate, endDate] : startDate || null);

    // Functie om het bereik bij te werken
    const handleDateChange = (value: LooseValue) => {
        // Controleer of value een bereik van twee datums is
        if (Array.isArray(value)) {
            const [start, end] = value;
            // Update start- en einddatum, maar zorg ervoor dat we ze goed formatteren
            if (start) {
                setStartDate(getUtcDateAtStartOfDay(start as Date)); // Zorg ervoor dat de startdatum altijd op het begin van de dag staat
            }
            if (end) {
                setEndDate(getUtcDateAtStartOfDay(end as Date)); // En hetzelfde voor de einddatum
            }
            // Zet de range state om de geselecteerde datums bij te houden
            setRange([start as Date, end as Date]);
        } else {
            // Als de waarde geen bereik is, is het de eerste datum die we kiezen (startdatum)
            if (!Array.isArray(range)) {
                // Eerste klik is de startdatum
                setRange([value as Date, null]);
                setStartDate(getUtcDateAtStartOfDay(value as Date));
            } else {
                // Tweede klik is de einddatum
                setRange([range[0], value as Date]);
                setEndDate(getUtcDateAtStartOfDay(value as Date));
            }
        }
    };

    const getMinEndDate = () => {
        if (startDate) {
            const start = new Date(startDate);
            start.setDate(start.getDate());
            return start;
        }
        return minDate;
    };

    useEffect(() => {
        // Initialiseer het bereik met de huidige start- en einddatum
        setRange([startDate || null, endDate || null]);
    }, [startDate, endDate]);

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex-1">
                <label>{t('selectDateRange')}</label>
                <DateRangePicker
                    value={range} // De value moet een LooseValue zijn
                    onChange={handleDateChange} // Update het geselecteerde bereik
                    minDate={getMinEndDate()} // Zorg ervoor dat einddatum later is dan startdatum
                    className="bg-cyan-800 w-full p-2"
                    format="yyyy-MM-dd" // Kies een gewenst datumformaat
                    clearIcon={null}
                />
            </div>
        </div>
    );
};

export default DateRangePickerComponent;

