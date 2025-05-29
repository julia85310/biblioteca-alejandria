'use client'
import MyHeader from "@/app/components/MyHeader"
import { useState } from "react"

export default function NuevoLibroPage() {
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
  })

  const [imagen, setImagen] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)

  

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImagen(file)
      setImagenPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value)
    })
    if (imagen) {
      data.append('imagen', imagen)
    }

    const res = await fetch('/api/libro', {
      method: 'POST',
      body: data,
    })

    if (res.ok) {
      alert('Libro guardado')
    } else {
      alert('Error al guardar el libro')
    }
  }

  return <div>
    <MyHeader></MyHeader>
    <form onSubmit={handleSubmit} className="font-admin flex lg:flex-row flex-col min-h-[100vh] bg-[var(--aliceBlue)] text-[var(--paynesGray)] p-12 gap-4 pt-4 text-[1.2em]">
        <div className="flex flex-col gap-4">
            <div>
                <label htmlFor="isbn" className="block mb-1">ISBN</label>
                <input value={formData.isbn} id="isbn" name="isbn" placeholder="ISBN" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="titulo" className="block mb-1">Título</label>
                <input value={formData.titulo} id="titulo" name="titulo" placeholder="Título" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="autor" className="block mb-1">Autor</label>
                <input value={formData.autor} id="autor" name="autor" placeholder="Autor" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="editorial" className="block mb-1">Editorial</label>
                <input value={formData.editorial} id="editorial" name="editorial" placeholder="Editorial" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="valor" className="block mb-1">Valor</label>
                <input value={formData.valor} id="valor" name="valor" placeholder="Valor" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>
        </div>
        <div className="flex flex-col gap-4">
            <div>
                <label htmlFor="condicion" className="block mb-1">Condición</label>
                <input value={formData.condicion} id="condicion" name="condicion" placeholder="nuevo" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="ano_publicacion" className="block mb-1">Año de publicación</label>
                <input value={formData.ano_publicacion} id="ano_publicacion" name="ano_publicacion" placeholder="Año de publicación" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="genero" className="block mb-1">Género</label>
                <input value={formData.genero} id="genero" name="genero" placeholder="Género" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div>
                <label htmlFor="dias_prestamo" className="block mb-1">Días de préstamo</label>
                <input value={formData.dias_prestamo} id="dias_prestamo" name="dias_prestamo" placeholder="4" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>

            <div className="flex flex-row gap-6">
                <div>
                    <label htmlFor="estante" className="block mb-1">Estante</label>
                    <input value={formData.estante} id="estante" name="estante" placeholder="Estante" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
                </div>
                <div>
                    <label htmlFor="balda" className="block mb-1">Balda</label>
                    <input value={formData.balda} id="balda" name="balda" placeholder="Balda" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-full" />
            </div>
            </div>
        </div>
        <div className="flex flex-col gap-10">
            <div>
                <label htmlFor="descripcion" className="block mb-1">Descripción</label>
                <textarea value={formData.descripcion} id="descripcion" name="descripcion" placeholder="Descripción" onChange={() => setFormData({ ...formData, [e.target.name]: e.target.value })} required className=" border rounded-xl border-[var(--columbiaBlue)] p-2 w-full focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-row justify-between">
                <label className="block mb-1">Portada</label>
                {imagenPreview ? (
                    <img
                    src={imagenPreview}
                    alt="Previsualización"
                    className="w-32 h-48 object-cover border"
                    />
                ) : (
                    <div >
                    <label
                        htmlFor="imagen"
                        className=" px-4 py-2 bg-[var(--columbiaBlue)] text-white rounded-3xl "
                    >
                        Subir imagen
                    </label>
                    <input
                        id="imagen"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-14 pb-8 mr-[-1em]">
                <button type="submit" className="px-6 py-2 rounded font-bold bg-[var(--columbiaBlue)] rounded-3xl">
                    Añadir libro
                </button>
            </div>
            
        </div>
    </form>
    </div>
}

