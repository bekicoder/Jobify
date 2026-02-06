"use client"
import { useEffect,useState } from "react";
import  Link  from "next/link"; 
const Hero = () => {
  const [user,setUser] = useState()
useEffect(()=>{
  const fetchUser = async()=>{
    const res = await fetch('/api/users')
    const data =await res.json();
     setUser(data)
  }
  fetchUser()
},[])
  return (
    <div className="w-full flex flex-col md:flex-row overflow-auto">
        <div className="px-10 pt-24  wrap-break-word flex flex-1 flex-col gap-5" >
          <h1 className="font-bold text-5xl text-[#0a2540] leading-tight">Step Into Your Future with the Perfect Job</h1>
          <p>Browse thousands of openings, apply in seconds, and land the role you deserve.</p>
          <Link href={user?.role == "employee" ? "/jobs" : "/dashboard"} className="w-fit px-4 py-2 rounded-full bg-sky-500 text-white font-bold cursor-pointer hover:bg-[#0a2540]">
                        {user?.role == "employee" ? "Find Jobs" : "Dashboard"}&nbsp;<i className="fa-solid fa-chevron-right scale-75 my-auto"></i>
          </Link>
        </div>
        <div className="w-full md:w-[50%] relative pt-16 flex overflow-hidden gap-7">
          <div className="flex flex-col gap-7">
              <div className="overflow-hidden rounded-2xl"><div className="cursor-pointer w-50 h-80 bg-gray-200 transition duration-200 bg-[url('/close-up-new-york-maintenance-worker.jpg')] bg-cover hover:scale-110 bg-center flex-none"></div></div>
          </div>
          <div className="flex flex-col gap-7 h-fitt">
              <div className="overflow-hidden rounded-2xl"><div className="cursor-pointer w-80 h-50 rounded-3xl transition duration-200 hover:scale-110 bg-gray-200 bg-[url('/vintage-style-office-workers-having-desk-job.jpg')] bg-cover"></div></div>
          <div className="flex flex-row gap-7 overflow-hidden">
              <div className="overflow-hidden rounded-2xl"><div className="cursor-pointer w-50 h-50 rounded-3xl bg-gray-200 bg-[url('/construction-workers-welding-steel-beams.jpg')] bg-cover transition duration-200 hover:scale-110"></div></div>
              <div className="overflow-hidden rounded-2xl"><div className="cursor-pointer h-50 w-90 bg-gray-200 rounded-3xl bg-[url('/chef-cooking-kitchen-while-wearing-professional-attire.jpg')] bg-cover transition duration-200 hover:scale-110"></div></div>
          </div>
          </div>
        </div>
        
    </div>
  );
};

export default Hero;