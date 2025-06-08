
import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarSelectEvent({ reservas, historial, prestamos, handleClick }) {
    const [librosInfo, setLibrosInfo] = useState({});
    const fechasMapeadas = useMemo(() => {
        const parseFecha = (f) => new Date(f.slice(0, 10)).setHours(0, 0, 0, 0);
        const output = [];

        const agregar = (tipo, data) => {
            data.forEach(e => {
                output.push(
                    { key: parseFecha(e.fecha_adquisicion), tipo, rol: 'adquisicion' },
                    { key: parseFecha(e.fecha_devolucion), tipo, rol: 'devolucion' }
                );
            });
        };

        agregar('historial', historial);
        agregar('prestamo', prestamos);
        agregar('reserva', reservas);
        console.log('prestamos:', prestamos)
        return output;
    }, [historial, prestamos, reservas]);

    const getInfoDelDia = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        const time = normalized.getTime();
        return fechasMapeadas.filter(f => f.key === time);
    };

    async function obtenerNombreLibro(libroId) {
        if (librosInfo[libroId]) return librosInfo[libroId];
        try {
            const res = await fetch("/api/libro?id=" + libroId);
            const data = await res.json();
            if (!res.ok) throw new Error("Error al obtener libro");

            setLibrosInfo(prev => ({ ...prev, [libroId]: data.titulo }));
            console.log("Nombre libro:")
            console.log(data)
            return data.titulo;
        } catch (err) {
            alert("Ha ocurrido un error. Inténtelo de nuevo más tarde");
            return null;
        }
    }

    async function handleClickHere(eventos) {
        if (!eventos || eventos.length === 0) return;

        console.log('eventos:', eventos)

        const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };

        const fecha = eventos[0].fecha.toLocaleDateString('es-ES', opcionesFecha);

        const entradas = [];

        const descripciones = await Promise.all(eventos.map(async (ev) => {
            let entrada = null;

            const toLocalDateString = (input) => {
                if (typeof input === 'string') {
                    return input.slice(0, 10); // Solo YYYY-MM-DD
                }
                const d = new Date(input);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            console.log('Fecha evento:', toLocalDateString(ev.fecha));
            console.log('Reservas:', reservas.map(h => ({
                a: toLocalDateString(h.fecha_adquisicion),
                d: toLocalDateString(h.fecha_devolucion),
                id: h.libro
            })));

            const esFechaEvento = (item) => (
                toLocalDateString(item.fecha_adquisicion) === toLocalDateString(ev.fecha) ||
                toLocalDateString(item.fecha_devolucion) === toLocalDateString(ev.fecha)
            );

            if (ev.tipo === 'historial') {
                entrada = historial.find(h =>
                    esFechaEvento(h) && !entradas.includes(h)
                );
            } else if (ev.tipo === 'prestamo') {
                entrada = prestamos.find(p =>
                    esFechaEvento(p) && !entradas.includes(p)
                );
            } else if (ev.tipo === 'reserva') {
                entrada = reservas.find(r =>
                    esFechaEvento(r) && !entradas.includes(r)
                );
            }
                
            console.log("Entradas encontradas:")
            console.log(entrada)   

            if (!entrada) return null;

            entradas.push(entrada)

            const nombreLibro = await obtenerNombreLibro(entrada.libro);
            if (!nombreLibro) return null;

            if (ev.tipo === 'reserva' && ev.rol === 'adquisicion') {
                return `Reserva ${nombreLibro}`;
            }

            if (ev.rol === 'adquisicion') {
                return `Adquisición ${nombreLibro}`;
            }

            if (ev.rol === 'devolucion') {
                return `Devolución ${nombreLibro}`;
            }

            return null;
        }));

        const descripcionesStr = descripciones.join(', ');

        console.log("Fecha:" + fecha)
        console.log("Descripcion" + descripcionesStr)

        handleClick(fecha, descripcionesStr);
    }

    return (
        <div className="m-4 lg:w-[20vw] max-w-md mx-auto border border-[var(--lion)] rounded-2xl border-5">
            <div className='border border-[var(--darkSeashell)] rounded-2xl border-3'>
                <style>{`
                    .react-calendar {
                        background-color: var(--seashell);
                        border: none;
                        padding: 1rem;
                        width: 100%;
                    }

                    .react-calendar__tile--active {
                        background: transparent !important;
                        color: inherit !important;
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

                    .bg-historial {
                        background-color: var(--paynesGray) !important;
                        color: white !important;
                    }

                    .bg-prestamo-adquisicion {
                        background-color: green !important;
                        color: white !important;
                    }

                    .bg-prestamo-devolucion {
                        background-color: red !important;
                        color: white !important;
                    }

                    .bg-reserva {
                        background-color: var(--ecru) !important;
                        color: #222 !important;
                    }

                    .react-calendar__tile:hover {
                        cursor: pointer;
                        opacity: 0.9;
                    }

                    .react-calendar__month-view__weekdays abbr {
                        text-decoration: none !important;
                        font-weight: 600;
                        font-size: 0.875rem;
                        color: #333;
                    }

                    .react-calendar__month-view__days {
                        display: grid !important;
                        grid-template-columns: repeat(7, 1fr);
                        gap: 0.6rem;
                    }

                    .react-calendar__tile--now:not(.bg-historial):not(.bg-reserva):not(.bg-prestamo-adquisicion):not(.bg-prestamo-devolucion) {
                        background-color: var(--darkSeashell) !important;
                        color: inherit !important;
                    }

                    @media (min-width: 1024px) {
                        .react-calendar {
                            padding: 0.3rem;
                            font-size: 0.7rem;
                        }

                        .react-calendar__navigation button {
                            font-size: 0.65rem !important;
                            padding: 0rem 0rem !important;
                        }

                        .react-calendar__navigation__label {
                            font-size: 0.8rem !important;
                        }

                        .react-calendar__month-view__weekdays abbr {
                            font-size: 0.65rem !important;
                            font-weight: 500;
                        }

                        .react-calendar__tile {
                            font-size: 0.7rem !important;
                            padding: 0.3rem !important;
                        }
                    }
                `}</style>

                <Calendar
                    onClickDay={(date) => {
                        const info = getInfoDelDia(date);
                        if (info.length > 0) {
                            const eventos = info.map(ev => ({
                                tipo: ev.tipo,
                                rol: ev.rol,
                                fecha: new Date(ev.key)
                            }));
                            handleClickHere(eventos);
                        }
                    }}
                    tileClassName={({ date, view }) => {

                        if (view !== 'month') return;

                        const info = getInfoDelDia(date);
                        if (info.length === 0) return;

                        console.log("Día:", date.toISOString(), "Eventos:", info);

                        return info
                            .map(ev => {
                                if (ev.tipo === 'historial') return 'bg-historial';
                                if (ev.tipo === 'reserva') return 'bg-reserva';
                                if (ev.tipo === 'prestamo') return `bg-prestamo-${ev.rol}`;
                                return '';
                            })
                            .join(' ');
                    }}
                />
            </div>
        </div>
    );
}
 