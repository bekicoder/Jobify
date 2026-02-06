"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import  Link  from "next/link"; 
import { usePathname } from "next/navigation";
import Acount from "../account/page";
export default function NavBar(){
    interface accountType{
        name : string;
        email: string;
        role: string;
        profile:string;
    }
    const pathname = usePathname()
    const [hovered,setHovered] = useState<boolean>(false)
    const [user,setUser] = useState<accountType | null>(null)
    const [profileShow,setprofileShow] = useState<boolean>(false)
    useEffect(()=>{
        const fetchData = async ()=>{
            const res =await fetch("/api/users/");
            const data =await res.json();
            if(data.message == "Unauthorized") return;
            setUser(data);
        }
        fetchData()
    },[])
    return(
        <nav className={`fixed z-10000 top-0 w-full bg-white h-12 items-center justify-between ${pathname == "/account" ? "hidden" : "flex"}`}>
            <Link href="/" className="relative m-2 flex gap-4 cursor-pointer">
                <div className="relative">
                <span className="block w-6 h-6 rounded-full bg-sky-500/50"></span>
                <span className="block w-6 h-6 rounded-full bg-sky-500 absolute top-0 -right-[50%] animate-circle"></span>
                </div>
                <span className="font-medium">Jobify</span>
            </Link>
            <ul className={`text-black flex p-2 pt-4 md:p-0 md:pr- bg-white md:bg-transparent gap-3 w-full h-screen md:h-fit items-start absolute top-full flex-col  transition-transform duration-300 font-medium ${hovered ? "translate-x-0" : "translate-x-full"} md:w-[60%] md:flex-row md:right-0 md:translate-x-0 md:top-0 md:gap-2 md:relative`}>
                <Link href="/" className="cursor-pointer w-full px-2 py-4 hover:bg-gray-100 transition duration-200 gap-2 flex items-center group md:flex md:justify-center h-12"><i className="fas fa-home text-gray-500 group-hover:text-gray-900 overflow-hidden md:w-0"></i>Home <span className="md:hidden ml-auto"><i className="fas fa-arrow-right ml-auto scale-0 group-hover:scale-100 transition overflow-hidden md:w-0 md: hidden"></i></span></Link>
                {user?.role == "employee" && <Link href="/jobs/employee?route=appliedJobs" className="cursor-pointer w-full px-2 py-4 hover:bg-gray-100 transition duration-200 flex items-center hover:text-gray-900 group md:flex md:justify-center h-12"><i className="fa-solid fa-briefcase text-gray-500 group-hover:text-gray-900 overflow-hidden md:w-0 mr-2"></i>Applied Jobs<span className="md:hidden ml-auto"><i className="fas fa-arrow-right ml-auto scale-0 group-hover:scale-100 transition overflow-hidden md:w-0 md: hidden"></i></span></Link>}
                {user?.role == "employee" && <Link href="/jobs/employee?route=savedJobs" className="cursor-pointer w-full px-2 py-4 hover:bg-gray-100 transition duration-200  gap-2 flex items-center hover:text-gray-900 group md:flex md:justify-center h-12"><i className="fa-solid fa-bookmark text-gray-500 group-hover:text-gray-900 overflow-hidden md:w-0"></i>Saved Jobs<span className="md:hidden ml-auto mr-3 "><i className="fas fa-arrow-right scale-0 group-hover:scale-100 transition"></i></span></Link>}
                <Link href={user?.role == "employee" ? "/jobs" : "/dashboard"} className="cursor-pointer w-full px-2 py-4 hover:bg-gray-100 transition duration-200  gap-2 flex items-center hover:text-gray-900 group md:flex md:justify-center h-12"><i className={`fa-solid fa-${user?.role == "employee" ? "building" : "gauge"} text-gray-500 group-hover:text-gray-900 overflow-hidden md:w-0`}></i>
                         {user?.role == "employee" ? "Find Jobs" : "Dashboard"}
                <span className="md:hidden ml-auto mr-3 "><i className="fas fa-arrow-right scale-0 group-hover:scale-100 transition"></i></span></Link>
                {user && <div className="max-md:mt-auto max-md:mb-15 relative gap-3 w-full bg-[#f1f5f9] md:bg-transparent h-20 md:h-fit flex items-center justify-start px-3 rounded-xl md:flex-col">

                    <div onClick={()=>setprofileShow(!profileShow)} className={`w-8 cursor-pointer h-8 mt-2 rounded-full flex justify-center items-center text-2xl text-white peer`} style={{ backgroundColor: user.profile }}>
                        {user.name.substr(0,1)}
                    </div>   
                    <div className={`text-sm peer-hover:block text-gray-600 md:absolute md:w-60  md:top-[130%] md:right-0 rounded md:bg-[#f1f5f9] md:py-4 md:px-2 ${profileShow ? "block" : "md:hidden"}`}>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <a href="/api/signout/" className="text-black mt-2 block font-bold">Sign out</a>
                    </div>                   
                </div>}

                {(!user && pathname != "/account")  && (<div className="bg-[#f1f5f9] md:bg-transparent w-full h-20 flex items-center justify-center rounded-xl md:hidden">
                    <a className="px-4 py-2 rounded-full bg-sky-500 text-white font-bold cursor-pointer hover:bg-[#0a2540]">
                        Log In&nbsp;<i className="fa-solid fa-chevron-right scale-75 my-auto"></i>
                    </a>
                </div>)}
            </ul>
            {!user && <Link href="/account" className={`max-md:hidden mr-4 flex-none my-auto px-4 py-2 rounded-full bg-sky-500 text-white font-bold cursor-pointer hover:bg-[#0a2540] ${pathname == "/account" && "opacity-0 pointer-events-none"}`}>
                    Log In&nbsp;<i className="fa-solid fa-chevron-right scale-75 my-auto"></i>
            </Link>}
            <button className="cursor-pointer w-8 h-8 flex flex-col gap-2 rounded-full flex items-center justify-center hover:bg-[#f1f5f9] md:hidden" onClick={()=>setHovered((prev)=>!prev)}>
                <span className={`w-5 h-0.5 bg-black origin-left transition delay-100 ${hovered ? "rotate-45 -translate-y-0.5 translate-x-1" : "rotate-0"}`}></span>
                <span className={`w-5 h-0.5 bg-black origin-left transition delay-100 ${hovered ? "-rotate-45 translate-y-0.5 translate-x-1" : "rotate-0"}`}></span>
            </button>
        </nav>
    )
}