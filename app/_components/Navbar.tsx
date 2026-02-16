"use client";
import Image from "next/image";
import { useEffect, useState,useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSharedState } from '../SharedStateContext';
import { text } from "stream/consumers";
export default function NavBar() {
  type Language = {
  id: number;
  language: string;
  short_name:string;
};

  const pathname = usePathname();
  const [hovered, setHovered] = useState<boolean>(false);
  const [user, setUser] = useState<Record<string,string> | null>(null);
  const [profileShow, setprofileShow] = useState<boolean>(false);
  const {content,lightDark} = useSharedState()
  const [languages] = useState([{id:1,language:"English",short_name:"En"},{id:2,language:"Français",short_name:"Fr"},{id:3,language:"العربية",short_name:"Ar"},{id:4,language:"አማርኛ",short_name:"Am"}])
  const {lang,setLang,mode,setMode,textColor,bgColor} = useSharedState()
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
  const loadcontent = async () => {
    const selectedLang = localStorage.getItem("lang");
    if(!selectedLang){
        localStorage.setItem(lang,lang)
      }
    else if(selectedLang){
      setLang(selectedLang)
    }
    const fetchData = async () => {
      const res = await fetch("/api/users/");
      const data = await res.json();
      if (data.message === "Unauthorized") return;
     console.log(data,"this is the user data")
      setUser(data);
    };
    fetchData();
  };

  loadcontent();
}, []);


  const dropdownRef = useRef<HTMLDivElement>(null);
  
   useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      const target = event.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleTranslation(lang:string){
    localStorage.setItem("lang",String(lang))
    setLang(lang)
  }
  async function changeMode(){
    if(mode == "light") setMode("dark")
    else if(mode == "dark") setMode("light")
  }
  return (
    <nav
  className={`fixed top-0 left-0 z-1000000 w-full backdrop-blur-md bg-${bgColor} border-b border-gray-200/40 text-${textColor} h-14 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${
    pathname == "/account" ? "hidden" : "flex"
  }`}
>
  <Link
    href="/"
    onClick={() => setHovered((prev) => !prev)}
    className="flex items-center gap-3 group"
  >
    <div className="relative">
      <span className="block w-6 h-6 rounded-full bg-sky-500/40"></span>
      <span className="block w-6 h-6 rounded-full bg-sky-600 absolute top-0 -right-2 group-hover:scale-110 transition-transform duration-300"></span>
    </div>
    <span className="text-lg font-semibold tracking-wide group-hover:text-sky-600 transition">
      Jobify
    </span>
  </Link>

  <ul
    className={`fixed md:static top-14 right-0 w-72 md:w-auto h-[calc(100vh-3.5rem)] md:h-auto bg-${bgColor} md:bg-transparent shadow-2xl md:shadow-none border-l md:border-0 border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col md:flex-row md:items-center gap-2 md:gap-4 px-6 md:px-0 py-6 md:py-0 ${
      hovered ? "translate-x-0" : "translate-x-full md:translate-x-0"
    }`}
  >
    <Link
      href="/"
      onClick={() => setHovered((prev) => !prev)}
      className="w-full md:w-auto px-4 py-2 rounded-lg hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200 flex items-center justify-between md:justify-center font-medium text-sm tracking-wide"
    >
      {content?.home_link}
    </Link>

    {user?.role == "employee" && (
      <Link
        href="/jobs?route=appliedJobs"
        onClick={() => setHovered((prev) => !prev)}
        className="w-full md:w-auto px-4 py-2 rounded-lg hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200 flex items-center justify-between md:justify-center font-medium text-sm tracking-wide"
      >
        {content?.sent_link}
      </Link>
    )}

    {user?.role != "employer" && (
      <Link
        href="/jobs?route=savedJobs"
        onClick={() => setHovered((prev) => !prev)}
        className="w-full md:w-auto px-4 py-2 rounded-lg hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200 flex items-center justify-between md:justify-center font-medium text-sm tracking-wide"
      >
        {content?.saved_link}
      </Link>
    )}

    <Link
      href={user?.role == "employer" ? "/dashboard" : "/jobs"}
      onClick={() => setHovered((prev) => !prev)}
      className="w-full md:w-auto px-4 py-2 rounded-lg hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200 flex items-center justify-between md:justify-center font-medium text-sm tracking-wide"
    >
      {user?.role == "employer"
        ? content?.dashboard_link
        : content?.explore_link}
    </Link>

    {!user && (
      <div className="md:hidden mt-6">
        <Link
          href="/account"
          onClick={() => setHovered((prev) => !prev)}
          className="block text-center px-4 py-2 rounded-full bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
        >
          {content.logIn}
        </Link>
      </div>
    )}
  </ul>

  <div className="flex items-center gap-3">
    
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-${lightDark} cursor-pointer transition text-sm font-medium`}
      >
        {lang}
        <i className="fa-solid fa-chevron-down text-xs mt-1"></i>
      </button>

      {isOpen && (
        <ul className={`absolute right-0 mt-3 w-40 bg-${bgColor} rounded-xl shadow-xl border border-gray-200 py-2`}>
          {languages &&
            languages.map((language: Language) => (
              <li
                key={language.id}
                className={`flex items-center gap-3 px-4 py-2 hover:bg-${lightDark} cursor-pointer text-sm`}
                onClick={() => {
                  setIsOpen(false);
                  handleTranslation(language.short_name);
                }}
              >
                <input
                  type="radio"
                  checked={lang === language.short_name}
                  readOnly
                  className="accent-blue-600"
                />
                <span>{language.language}</span>
              </li>
            ))}
        </ul>
      )}
    </div>

    <button
      onClick={changeMode}
      className={`w-9 h-9 flex items-center justify-center rounded-full bg-${lightDark} hover:scale-105 transition-transform duration-200 shadow-sm`}
    >
      <i
        className={`fas text-${textColor} text-sm fa-${
          mode == "light" ? "moon" : "sun"
        }`}
      />
    </button>

    {user && (
      <div className="relative">
        <div
          onClick={() => setprofileShow(!profileShow)}
          className="w-9 h-9 rounded-full flex justify-center items-center text-white cursor-pointer"
          style={{ backgroundColor: user.profile }}
        >
          {user.name.substr(0, 1)}
        </div>

        <div
          className={`absolute right-0 mt-3 w-64 bg-${bgColor} rounded-xl shadow-2xl border border-gray-200 p-4 text-sm transition-all duration-200 ${
            profileShow ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <i className="fa-solid fa-user text-gray-500"></i>
              {user.name}
            </p>

            <p className="flex items-center gap-2">
              <i className="fa-solid fa-envelope text-gray-500"></i>
              {user.email}
            </p>

            <p className="flex items-center gap-2">
              <Image
                width={20}
                height={20}
                src={user.flag}
                alt={user[`${lang.toLowerCase()}Location`]}
                className="aspect-video"
              />
              {user[`${lang.toLowerCase()}Location`]}
            </p>

            <a
              href="/api/signout/"
              className="block text-purple-600 font-medium pt-2 border-t border-gray-200"
            >
              {content.signOut}
            </a>
          </div>
        </div>
      </div>
    )}

    {!user && (
      <Link
        href="/account"
        className={`hidden md:block px-4 py-2 rounded-full bg-sky-600 text-white font-medium hover:bg-sky-700 transition ${
          pathname == "/account" && "opacity-0 pointer-events-none"
        }`}
      >
        {content.logIn}
      </Link>
    )}

    <button
        className={`cursor-pointer w-8 h-8 flex flex-col gap-2 rounded-full flex items-center justify-center hover:bg-${mode=="light"?"[#f1f5f9]":lightDark} md:hidden`}
        onClick={() => setHovered((prev) => !prev)}
        onBlur={() =>setTimeout(()=>setHovered(false),1000)}
      >
        <span
          className={`w-5 h-0.5 bg-${textColor} origin-left transition delay-100 ${hovered ? "rotate-45 -translate-y-0.5 translate-x-1" : "rotate-0"}`}
        ></span>
        <span
          className={`w-5 h-0.5 bg-${textColor} origin-left transition delay-100 ${hovered ? "-rotate-45 translate-y-0.5 translate-x-1" : "rotate-0"}`}
        ></span>
      </button>
  </div>
</nav>

  );
}
