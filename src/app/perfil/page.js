'use client'
import { AuthContext } from "../contexts/AuthContext"
import Header from "../components/Header"
import Footer from "../components/Footer"
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
        <Header ubiHeader="Perfil"></Header>
        <img src="/iconos/icono-logout.png" onClick={cerrarSesion}></img>
        <Footer></Footer>
    </div>
}