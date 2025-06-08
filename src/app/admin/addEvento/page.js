'use client'
import MyHeader from "@/app/components/MyHeader"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation";
import { validarDatosNuevoEvento } from "@/app/libs/evento";
import Loader from "@/app/components/loader/Loader";

export default function NuevoEventoPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        imagen: null
    });

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const [imagenPreview, setImagenPreview] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, imagen: file });
            setImagenPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        const validacion = validarDatosNuevoEvento(formData)
        if (!validacion.valid){
            setLoading(false)
            alert(validacion.message)
            return
        } 

        const formDataToSend = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            formDataToSend.append(key, value);
        }

        const res = await fetch("/api/evento", {
            method: "POST",
            body: formDataToSend,
        });

        if (res.ok) {
            alert('Evento añadido con éxito.');
            router.push("/admin");
        } else {
            setLoading(false)
            const errorData = await res.json();
            alert(errorData.error);
        }
    };

    return (
        <div className="min-h-[100vh] bg-[var(--aliceBlue)] flex flex-col lg:gap-8 ">
            <MyHeader />
            <form onSubmit={handleSubmit} className="lg:min-h-[60vh] font-admin flex lg:flex-row flex-col text-[var(--paynesGray)] p-12 gap-4 pt-4 text-[1.2em] lg:text-[2.5vh] lg:justify-around lg:gap-1 lg:p-0 lg:min-h-[70vh]">
                <div className="flex flex-col lg:gap-8 gap-4 lg:w-[27vw] lg:justify-around ">
                    <div>
                        <label htmlFor="titulo" className="block mb-1">Título</label>
                        <input value={formData.titulo} id="titulo" name="titulo" placeholder="Título" onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block mb-1">Descripción</label>
                        <textarea className="text-sm min-h-[19vh] border rounded-xl border-[var(--columbiaBlue)] p-2 w-full focus:outline-none focus:ring-0" value={formData.descripcion} id="descripcion" name="descripcion" placeholder="Descripción" onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
                    </div>
                </div>

                <div className="flex flex-col gap-10 lg:gap-8 lg:justify-around lg:w-[27vw]">
                    <div>
                        <label htmlFor="fecha" className="block mb-1">Fecha</label>
                        <input type="date" min={new Date().toISOString().split('T')[0]} value={formData.fecha} id="fecha" name="fecha" onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
                    </div>

                    <div className={`lg:min-h-[25vh] flex flex-row gap-6 lg:gap-2 justify-between ${imagenPreview && "lg:flex-col"}`}>
                        <label className="block mb-1">Imagen</label>
                        {imagenPreview ? (
                            <div className="flex justify-end">
                                <img
                                    src={imagenPreview}
                                    alt="Previsualización"
                                    className="lg:max-h-[25vh] h-58 object-contain cursor-pointer"
                                    onClick={() => fileInputRef.current.click()}
                                />
                                <input
                                    ref={fileInputRef}
                                    id="imagen"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div>
                                <label
                                    htmlFor="imagen"
                                    className="px-4 py-2 bg-[var(--columbiaBlue)] text-white rounded-3xl cursor-pointer"
                                >
                                    Subir imagen
                                </label>
                                <input
                                    ref={fileInputRef}
                                    id="imagen"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-14 pb-8 mr-[-1em] lg:py-0 ">
                        <button type="submit" className="px-6 py-2 rounded font-bold bg-[var(--columbiaBlue)] rounded-3xl">
                            Añadir evento
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
