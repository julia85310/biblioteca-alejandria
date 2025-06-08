import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  isBefore,
  isAfter,
  addDays
} from 'date-fns';

export default function CalendarSelectFecha({handleDateClick, diasLibro, intervalosRestringidos}){
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedRange, setSelectedRange] = useState([]);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);
    const maxDate = addDays(today, 180);

    const intervalosDate = useMemo(() =>
        intervalosRestringidos.map(([start, end]) => {
            const startNoTZ = new Date(start);
            startNoTZ.setHours(0, 0, 0, 0);

            const endNoTZ = new Date(end);
            endNoTZ.setHours(0, 0, 0, 0);

            return { start: startNoTZ, end: endNoTZ };
        }),
        [intervalosRestringidos]
    );

    console.log(intervalosDate)

    //mira si una fecha esta deshabilitada (mas de 6 meses, pasada o en el rango restringido)
    function isInDisabledRange(date) {
        const localDate = new Date(date);
        localDate.setHours(0, 0, 0, 0);

        return (
            isBefore(localDate, today) ||
            isAfter(localDate, maxDate) ||
            intervalosDate.some(interval =>
                localDate >= interval.start && localDate <= interval.end
            )
        );
    }

    function calcularRango (startDate) {
        const rango = [];
        let current = new Date(startDate);
        let count = 0;

        while (count < diasLibro) {
            //la fecha de devolución cae en un rango no permitido
            if (isInDisabledRange(current)) {
                return null;
            }
            rango.push(new Date(current));
            current = addDays(current, 1);
            count++;
        }

        return rango;
    };

    function handleClick (timezone){
        const year = timezone.getFullYear();
        const month = (timezone.getMonth() + 1).toString().padStart(2, '0'); 
        const day = timezone.getDate().toString().padStart(2, '0');
        const date = `${year}-${month}-${day}`;

        if (isInDisabledRange(date)) return;
        console.log(date)
        const rango = calcularRango(date);
        if (!rango) return;

        setSelectedStart(date);
        setSelectedRange(rango);
        const fechaFin = rango[rango.length - 1];
        handleDateClick(date, fechaFin);
    };

    return <div className="m-4 lg:w-[24vw]  max-w-md mx-auto border border-[var(--lion)] rounded-2xl border-5">
        <div className='border border-[var(--darkSeashell)] rounded-2xl border-3'>
            <style>
            {`
            .react-calendar {
                background-color: var(--seashell);
                border: none;
                padding: 1rem;
                width: 100%;
            }

            .react-calendar__tile {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                text-align: center;
                padding: 0.5rem;
                border-radius: 9999px;
                width: 100%;
                height: 100%;
                transition: background-color 0.2s ease;
            }

            /* Encabezado de días (Lun, Mar, etc.) */
            .react-calendar__month-view__weekdays {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
            }

            /* Quitar subrayado punteado */
            .react-calendar__month-view__weekdays abbr {
                text-decoration: none !important;
                font-weight: 600;
                font-size: 0.875rem;
                color: #333;
            }

            /* Día seleccionado */
            .react-calendar__tile.selected {
                background-color: var(--lion) !important;
                color: white !important;
            }

            /* Días ocupados (rango bloqueado) */
            .react-calendar__tile.occupied {
                background-color: var(--seashell) !important;
                color: var(--rojo) !important;
                pointer-events: none;
            }

            /* Fin de semana sin color rojo por defecto */
            .react-calendar__month-view__days__day--weekend {
                color: inherit !important;
            }

            .react-calendar__navigation button:hover {
                background-color: var(--darkSeashell) !important;
            }

            /* Distribución en grilla con espacios */
            .react-calendar__month-view__days {
                display: grid !important;
                grid-template-columns: repeat(7, 1fr);
                gap: 0.6rem;
            }

            /* Hover en selección de mes/año/década */
            .react-calendar__tile--hasActive:hover,
            .react-calendar__year-view__months__month:hover,
            .react-calendar__decade-view__years__year:hover,
            .react-calendar__century-view__decades__decade:hover {
                background-color: var(--darkSeashell) !important;
                color: inherit;
            }

            .react-calendar__navigation button:focus,
            .react-calendar__navigation button:active {
                background-color: var(--darkSeashell) !important;
                box-shadow: none !important;
                outline: none !important;
            }
            

            /* Flechas de navegación desactivadas */
            .react-calendar__navigation button:disabled {
                background-color: var(--darkSeashell) !important;
                color: #aaa;
                cursor: not-allowed;
            }

            /* Quitar fondo amarillo de hoy */
            .react-calendar__tile--now {
                background-color: var(--darkSeashell) !important;
                color: inherit !important;
            }

            .react-calendar__tile.selected:hover {
                background-color: var(--lion) !important;
                color: white !important;
            }

            .react-calendar__tile:not(.selected):not(.occupied):hover {
                background-color: var(--darkSeashell) !important;
                color: inherit !important;
            }

            @media (min-width: 1024px) {
                /* Contenedor general */
                .react-calendar {
                    padding: 0.3rem;
                    font-size: 0.7rem; /* fallback base */
                }

                /* Flechas de navegación y mes actual */
                .react-calendar__navigation button {
                    font-size: 0.65rem !important; /* más pequeño */
                    padding: 0rem 0rem !important;
                }

                .react-calendar__navigation__label {
                    font-size: 0.8rem !important;
                }

                /* Días de la semana (Lun, Mar, etc.) */
                .react-calendar__month-view__weekdays abbr {
                    font-size: 0.65rem !important;
                    font-weight: 500;
                }

                /* Números de días */
                .react-calendar__tile {
                    font-size: 0.7rem !important;
                    padding: 0.3rem !important;
                }
            }
                
            `}
            </style>

            <Calendar
                onClickDay={handleClick}
                value={selectedStart}
                minDate={today}
                maxDate={maxDate}
                tileClassName={({ date, view }) => {
                    if (view !== 'month') return;

                    if (isInDisabledRange(date)){
                        return 'occupied';
                    } 
                        

                    if (selectedRange.find(d => d.toDateString() === date.toDateString())) {
                        return 'selected';
                    }

                    return '';
                }}
            />
        </div>
    </div>
}
