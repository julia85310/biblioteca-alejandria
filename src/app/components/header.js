'use client'
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Header({ubiHeader}){
    const { user } = useContext(AuthContext);
    const [menuHidden, setMenuHidden] = useState(true);
    const [animating, setAnimating] = useState("");
    const router = useRouter();

    function abrirMenu(){
        setMenuHidden(!menuHidden);
    }

    function handleClickNav(botonNav, ubiHeader){
        if (botonNav != ubiHeader){
            setAnimating(botonNav);
            setTimeout(() => setAnimating(""), 300);
            if(botonNav == "Home"){
                router.push("../");
            }else if(botonNav == "Catalogo"){
                router.push("../catalogo");
            }else if(botonNav == "Perfil"){
                console.log("usuario:")
                console.log(user)
                if(!user){
                    router.push("../auth/login"); 
                }else if(user.admin){
                    router.push("../admin");
                }else{
                    router.push("../perfil");
                }
            }
        }
    }

    return <header className={`relative flex flex-row items-center lg:items-end px-6 pt-6 lg:px-12 lg:pt-10 justify-between pb-6 ${user?.admin ? "bg-[var(--aliceBlue)]" : "bg-[var(--seashell)]"}`}>
        <img src="../logo.png" className="w-24 lg:w-32"/> 
        <img className={`${!menuHidden && 'hidden'} lg:hidden z-10 w-10 h-8`} src="../iconos/icono-menu-hb.png" onClick={abrirMenu}></img>
        <nav className={`${menuHidden ? 'hidden' : 'flex'} lg:border-0 pr-12 border-[var(--cafeNoir)] border-2 rounded-xl z-50 ${user?.admin ? "bg-[var(--aliceBlue)]" : "bg-[var(--seashell)]"} pl-12 py-8 top-6 right-4 pr-4 text-center lg:text-base text-sm gap-6 lg:relative absolute z-20 lg:static lg:flex flex-col lg:flex-row justify-end items-end lg:gap-18 lg:px-12 lg:pb-4`}>
            <img className={`${menuHidden && 'hidden'} w-4 absolute top-3 right-3`} onClick={() => setMenuHidden(!menuHidden)} src="/iconos/icono-close.png"></img>
            <p className={`w-full underline-animate ${ubiHeader === "Home" ? "active" : ""} ${animating === "Home" ? "animate" : ""}`} onClick={()=>handleClickNav("Home", ubiHeader)}>Conócenos</p>
            <p className={`w-full underline-animate ${ubiHeader === "Catalogo" ? "active" : ""} ${animating === "Catalogo" ? "animate" : ""}`} onClick={()=>handleClickNav("Catalogo", ubiHeader)}>Catálogo</p>
            <p className={`w-full underline-animate ${ubiHeader === "Perfil" ? "active" : ""} ${animating === "Perfil" ? "animate" : ""}`} onClick={()=>handleClickNav("Perfil", ubiHeader)}>{user?.admin ? "Panel de Administración" : "Mi perfil"}</p>
        </nav>
    </header>
}

