'use client'
import MyHeader from "@/app/components/MyHeader"
import { useState, useRef } from "react"
import { validarDatosNuevoLibro } from "@/app/libs/libro"
import { useRouter } from "next/navigation";

export default function NuevoLibroPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        isbn: '',
        titulo: '',
        autor: '',
        editorial: '',
        valor: '',
        condicion: 'Nuevo',
        ano_publicacion: '',
        genero: '',
        dias_prestamo: '4',
        estante: '',
        balda: '',
        descripcion: '',
        imagen: null
    })

    const fileInputRef = useRef(null)
    const [imagenPreview, setImagenPreview] = useState(null)

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setFormData({...formData, imagen: file})
            setImagenPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validacion = validarDatosNuevoLibro(formData)
        if (!validacion.valid){
            alert(validacion.message)
            return
        } 

        const formDataToSend = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            formDataToSend.append(key, value);
        }

        const res = await fetch("/api/libro", {
            method: "POST",
            body: formDataToSend,
        });

        if (res.ok) {
            alert('Libro añadido con éxito.');
            router.push("/admin")
        } else {
            const errorData = await res.json();
            alert(errorData.error);
        }
    };

  return <div className="min-h-[100vh] bg-[var(--aliceBlue)]">
    <MyHeader></MyHeader>
    <form onSubmit={handleSubmit} className="font-admin flex lg:flex-row flex-col  text-[var(--paynesGray)] p-12 gap-4 pt-4 text-[1.2em] lg:text-sm lg:justify-around lg:gap-1 lg:p-0">
        <div className="flex flex-col gap-4 lg:w-[27vw] lg:justify-around">
            <div>
                <label htmlFor="isbn" className="block mb-1">ISBN</label>
                <input value={formData.isbn} id="isbn" name="isbn" placeholder="ISBN" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="titulo" className="block mb-1">Título</label>
                <input value={formData.titulo} id="titulo" name="titulo" placeholder="Título" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="autor" className="block mb-1">Autor</label>
                <input value={formData.autor} id="autor" name="autor" placeholder="Autor" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="editorial" className="block mb-1">Editorial</label>
                <input value={formData.editorial} id="editorial" name="editorial" placeholder="Editorial" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="valor" className="block mb-1">Valor</label>
                <input value={formData.valor} id="valor" name="valor" placeholder="Valor" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>
        </div>
        <div className="flex flex-col gap-4 lg:w-[27vw]">
            <div>
                <label htmlFor="condicion" className="block mb-1">Condición</label>
                <input value={formData.condicion} id="condicion" name="condicion" placeholder="nuevo" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="ano_publicacion" className="block mb-1">Año de publicación</label>
                <input value={formData.ano_publicacion} id="ano_publicacion" name="ano_publicacion" placeholder="Año de publicación" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="genero" className="block mb-1">Género</label>
                <input value={formData.genero} id="genero" name="genero" placeholder="Género" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="dias_prestamo" className="block mb-1">Días de préstamo</label>
                <input value={formData.dias_prestamo} id="dias_prestamo" name="dias_prestamo" placeholder="4" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div className="flex flex-row gap-6">
                <div>
                    <label htmlFor="estante" className="block mb-1">Estante</label>
                    <input value={formData.estante} id="estante" name="estante" placeholder="Estante" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
                </div>
                <div>
                    <label htmlFor="balda" className="block mb-1">Balda</label>
                    <input value={formData.balda} id="balda" name="balda" placeholder="Balda" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-10 lg:gap-2 lg:justify-between lg:w-[23vw]">
            <div className="lg:flex lg:flex-col ">
                <label htmlFor="descripcion" className="block mb-1">Descripción</label>
                <textarea className=" text-sm min-h-[19vh] border rounded-xl border-[var(--columbiaBlue)] p-2 w-full focus:outline-none focus:ring-0" value={formData.descripcion} id="descripcion" name="descripcion" placeholder="Descripción" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} />
            </div>

            <div className="flex flex-row  lg:gap-0 justify-between">
                <label className="block mb-1">Portada</label>
                {imagenPreview ? (
                    <div className="flex">
                        <img
                            src={imagenPreview}
                            alt="Previsualización"
                            className=" lg:w-28 w-32 h-48 object-contain cursor-pointer"
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

            <div className="flex justify-end pt-14 pb-8 mr-[-1em] lg:py-0 lg:pt-8">
                <button type="submit" className="px-6 py-2 rounded font-bold bg-[var(--columbiaBlue)] rounded-3xl">
                    Añadir libro
                </button>
            </div>
        </div>
    </form>
  </div>
}


