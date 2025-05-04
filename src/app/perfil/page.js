'use client'
import { AuthContext } from "../contexts/AuthContext"
import MyHeader from "../components/MyHeader"
import MyFooter from "../components/MyFooter"
import { useContext } from "react"
import { useRouter } from "next/navigation";

export default function PerfilPage(){
    const router = useRouter();
    const {logout} = useContext(AuthContext)

    function cerrarSesion(){
        logout();
        router.push("/")
    }

    return <div>
        <MyHeader ubiHeader="Perfil"></MyHeader>
        <h1>Pagina no implementada</h1>
        <img src="/iconos/icono-logout.png" onClick={cerrarSesion}></img>
        <MyFooter/>
    </div>
}