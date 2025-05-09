import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarSelectFecha({handleDateClick}){
    const [value, setValue] = useState(new Date());
    return <div>
        <Calendar
            onClickDay={(date) => handleDateClick(date)}
            value={value}
            tileClassName={({ date, view }) => {
            if (view === 'month' && isUnavailable(date)) {
                return 'unavailable';
            }
        }}
        />
    </div>
}