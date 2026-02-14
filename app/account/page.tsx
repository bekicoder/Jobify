"use client";
import React,{ FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSharedState } from "../SharedStateContext";
interface propType{
  setOpen:React.Dispatch<React.SetStateAction<string>>
}
const SignUp = ({ setOpen}:propType) => {
  type locations = {
    id: number;
    name: string;
    flag: string;
  };
 
  type checkbox = {
    role: string;
    location: number;
    flag: string;
  };
  const [type, setType] = useState<checkbox>({
    role: "employee",
    location:0,
    flag: "",
  });

  const router = useRouter();
  const [openedMenu, setOpenedMenu] = useState<string | null>(null);
  const [eye, setEye] = useState(false);
  const [warring, setWarrning] = useState<string>();
  const {countries,content} = useSharedState()

  function toggleRoleCheckbox(value: string) {
    setType((prev) => ({ ...prev, role: value }));
    setTimeout(() => {
      setOpenedMenu(null);
    }, 300);
  }
  function toggleLocationCheckbox(location: number, flag: string) {
    setType((prev) => ({ ...prev, location: location, flag: flag }));
    setTimeout(() => {
      setOpenedMenu(null);
    }, 300);
  }
  function toggleMenu(
    e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>,
    menu: string,
  ) {
    if (e.type == "blur" || openedMenu == menu) {
      setTimeout(() => {
        setOpenedMenu(null);
      }, 300);
    } else {

      setOpenedMenu(menu);
    }
  }
  async function handleSibmit(e:FormEvent) {
    e.preventDefault();
    const target = e.target as HTMLFormElement
    const fd = new FormData(target);
    const fdObj = Object.fromEntries(fd.entries());
    console.log(fdObj)
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(fdObj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.message == "successful") {
       location.assign("/");
    } else if (data.message == `already exist`) {
      setWarrning("already exist");
    }
  }
  return (
    <div className="w-full max-w-xl h-full md:h-124 md:rounded-r-2xl flex flex-col items-center bg-white md:px-18 px-10 pt-4">
      <strong className="text-2xl text-[#0a2540] mb-2">{content.signUp}</strong>
      <form
        onSubmit={(e) => handleSibmit(e)}
        className="flex flex-col gap-4 w-full"
      >
        {type.role == "employee" && (
          <div className="flex border border-gray-400 rounded p-1 px-2">
            <input
              type="text"
              name="fname"
              className="w-full focus:outline-0"
              placeholder={content.fname}
              required
            />
            <span>
              <i className="fa-solid fa-user text-gray-600 px-2"></i>
            </span>
          </div>
        )}
        {type.role == "employee" && (
          <div className="flex border border-gray-400 rounded p-1 px-2">
            <input
              type="text"
              name="lname"
              required
              className="w-full focus:outline-0"
              placeholder={content.lname}
            />
            <span>
              <i className="fa-solid fa-user text-gray-600 px-2"></i>
            </span>
          </div>
        )}
        {type.role == "employer" && (
          <div className="flex border border-gray-400 rounded p-1 px-2">
            <input
              type="text"
              name="orgname"
              required
              className="w-full focus:outline-0"
              placeholder={content.organizationName}
            />
            <span>
              <i className="fa-solid fa-user text-gray-600 px-2"></i>
            </span>
          </div>
        )}
        <div className="flex border border-gray-400 rounded p-1 px-2">
          <input
            type="email"
            name="email"
            required
            className="w-full focus:outline-0"
            placeholder={content.email}
          />
          <span>
            <i className="fa-solid fa-envelope text-gray-600 px-2"></i>
          </span>
        </div>
        <div className="flex border border-gray-400 rounded p-1 px-2">
          <input
            type={eye ? "text" : "password"}
            name="password"
            required
            className="w-full focus:outline-0"
            placeholder={content.password}
          />
          <span
            onClick={() =>
              setEye((prev) => {
                return !prev;
              })
            }
          >
            <i
              className={`fa-solid fa-${eye ? "eye-slash" : "eye"} text-gray-600 px-2`}
            ></i>
          </span>
        </div>

        {/*location choose box */}
        <div className="relative">
          <div
            onClick={(e) => toggleMenu(e, "Location")}
            onBlur={(e) => toggleMenu(e, "Location")}
            className="relative cursor-pointer flex rounded-lg item-center px-2 hover:bg-yellow-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-map-marker-alt text-gray-500" />
            {content.location}
            <input
              name="location"
              value={type.location}
              className="sr-only"
              required
            />
            <input name="flag" value={type.flag} className="sr-only" required/>
            <i
              className={`fa-solid ${openedMenu == "Location" ? "fa-chevron-up" : "fa-chevron-down"} ml-auto mr-2.5`}
            />
          </div>

          <div
            className={`filter-box z-1000 scale-95  absolute rounded-lg shadow-lg w-full top-[calc(100%+10px)] bg-white left-0 p-3 flex flex-col gap-2 overflow-x-auto whitespace-nowrap ${openedMenu != "Location" ? "h-0 py-0 overflow-y-hidden" : "h-50 py-4 overflow-y-auto"}`}
          >
            {countries.map((c, i) => (
              <div
                onClick={(e) => {
                  toggleLocationCheckbox(c.id, c.flag);
                }}
                key={i}
                className="flex cursor-pointer items-center gap-2 text-sm font-medium"
              >
                <span
                  className="w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 rounded block peer-checked:bg-sky-600 flex items-center justify-center"
                  style={{
                    backgroundColor:
                      type.location == c.id ? "#0ea5e9" : undefined,
                  }}
                >
                  <i
                    className="fa-solid fa-check scale-90 "
                    style={{ opacity: type.location === c.id ? 1 : 0 }}
                  ></i>
                </span>
                <Image
                  width={20}
                  height={20}
                  src={c.flag}
                  alt={c.name + " flag"}
                  className="h-fit aspect-video"
                />{" "}
                {c.name}
              </div>
            ))}
          </div>
        </div>

        {/*role choose box */}
        <div className="relative">
          <div
            onClick={(e) => toggleMenu(e, "role")}
            onBlur={(e) => toggleMenu(e, "role")}
            className="cursor-pointer flex rounded-lg item-center px-2 hover:bg-yellow-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-map-marker-alt text-gray-500" />
            {content.role}
            <i
              className={`fa-solid ${openedMenu == "role" ? "fa-chevron-up" : "fa-chevron-down"} ml-auto mr-2.5`}
            />
          </div>

          <div
            className={`filter-box z-1000 scale-95  absolute rounded-lg shadow-lg w-full top-[calc(100%+10px)] bg-white left-0 p-3 flex flex-col gap-2 overflow-x-auto whitespace-nowrap overflow-y-hidden ${openedMenu != "role" ? "h-0 py-0" : "h-fit py-4"}`}
          >
            {/*emloyer label */}
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                name="type"
                onChange={() => toggleRoleCheckbox("employer")}
                type="checkbox"
                value={type.role}
                className="peer sr-only"
                checked={true}
                required={type.role === "employer" || type == null}
              />
              <span
                className={`w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 rounded block ${type.role == "employer" && "bg-sky-600 text-white"} flex items-center justify-center`}
              >
                <i className="fa-solid fa-check scale-90"></i>
              </span>
              {content.employer}
            </label>
            {/*emloyee label */}
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                name="type"
                onChange={() => toggleRoleCheckbox("employee")}
                type="checkbox"
                value={type.role}
                checked={true}
                className="peer sr-only"
                required={type.role === "employee" || type == null}
              />
              <span
                className={`w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 ${type.role == "employee" && "text-white"} rounded block ${type.role == "employee" && "bg-sky-600"} flex items-center justify-center`}
              >
                <i className="fa-solid fa-check scale-90"></i>
              </span>
              {content.employee}
            </label>
          </div>
        </div>
  
        {warring === "already exist" && (
          <p>
            {content.alreadySignedInMessage} &nbsp;
            <span
              className="text-indigo-700 cursor-pointer"
              onClick={() => setOpen("signIn")}
            >
              {content.logIn}
            </span>
          </p>
        )}
        <button
          type="submit"
          className="px-6 py-2 rounded-full w-full bg-sky-600 hover:bg-[#0a2540] text-white font-medium cursor-pointer flex-none w-fit mx-auto"
        >
          {content.signUp}
        </button>
      </form>
      <span>
        {content.haveAccount} {" "}
        <span
          className="text-indigo-700 cursor-pointer"
          onClick={() => setOpen("signIn")}
        >
          {" "}
          {content.logIn}
        </span>{" "}
      </span>
    </div>
  );
};


const SignIn = ({ setOpen }:propType) => {
  const [type, setType] = useState<string>();
  const [eye, setEye] = useState(false);
  const [warring, setWarrning] = useState<string>();
  const [openedMenu, setOpenedMenu] = useState<string | null>(null);
  const router = useRouter();
  const {countries,content} = useSharedState()

  function toggleCheckbox(type: string) {
    setType(type);
    setOpenedMenu(null);
  }
  function toggleMenu(
    e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>,
    menu: string,
  ) {
    if (openedMenu == menu || e.type == "blur") {
      setTimeout(() => {
        setOpenedMenu(null);
      }, 300);
    } else {
      setOpenedMenu(menu);
    }
  }
  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement
    const fd = new FormData(target);
    const fdObj = Object.fromEntries(fd.entries());
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fdObj),
    });
    const data = await res.json();
    if (data.message == "successful") {
      location.assign("/");
    } else if (data.message == `don't exist`) {
      setWarrning("don't exist");
    }
  };
  return (
    <div
      className="w-full max-w-xl h-full md:h-124 md:rounded-r-2xl flex flex-col items-center bg-white  md:px-18 px-10 pt-4"
    >
      <strong className="text-2xl text-[#0a2540]">{content.logIn}</strong>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col pt-7 gap-4 w-full"
      >
        <div className="flex border border-gray-400 rounded p-1 px-2">
          <input
            type="email"
            name="email"
            className="w-full focus:outline-0"
            placeholder={content.email}
            required
          />
          <span>
            <i className="fa-solid fa-envelope text-gray-600 px-2"></i>
          </span>
        </div>
        <div className="flex border border-gray-400 rounded p-1 px-2">
          <input
            type={eye ? "text" : "password"}
            name="password"
            required
            className="w-full focus:outline-0"
            placeholder={content.password}
          />
          <span
            onClick={() =>
              setEye((prev) => {
                return !prev;
              })
            }
          >
            <i
              className={`fa-solid fa-${eye ? "eye-slash" : "eye"} text-gray-600 px-2`}
            ></i>
          </span>
        </div>

        <div className="relative">
          <div
            onClick={(e) => toggleMenu(e, "role")}
            onBlur={(e) => toggleMenu(e, "role")}
            className="cursor-pointer flex rounded-lg item-center px-2 hover:bg-yellow-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-map-marker-alt text-gray-500" />
            {content.role}
            <i
              className={`fa-solid ${openedMenu == "role" ? "fa-chevron-up" : "fa-chevron-down"} ml-auto`}
            />
          </div>

          <div
            className={`filter-box z-1000 scale-95  absolute rounded-lg shadow-lg w-full top-[calc(100%+10px)] bg-white left-0 p-3 flex flex-col gap-2 overflow-x-auto whitespace-nowrap overflow-y-hidden ${openedMenu != "role" ? "h-0 py-0" : "h-fit py-4"}`}
          >
            {/*emloyer label */}
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                name="type"
                onChange={() => toggleCheckbox("employer")}
                type="checkbox"
                value={type}
                className="peer sr-only"
                required={type === "employer" || type == null}
              />
              <span
                className={`w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 rounded block ${type == "employer" && "bg-sky-600 text-white"} flex items-center justify-center`}
              >
                <i className="fa-solid fa-check scale-90"></i>
              </span>
              {content.employer}
            </label>
            {/*emloyee label */}
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                name="type"
                onChange={() => toggleCheckbox("employee")}
                type="checkbox"
                value={type}
                className="peer sr-only"
                required={type === "employee" || type == null}
              />
              <span
                className={`w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 ${type == "employee" && "text-white"} rounded block ${type == "employee" && "bg-sky-600"} flex items-center justify-center`}
              >
                <i className="fa-solid fa-check scale-90"></i>
              </span>
              {content.employee}
            </label>
          </div>
        </div>

        {/*<div className="flex justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              name="type"
              onChange={() => setType("employer")}
              type="checkbox"
              value={type}
              className="peer sr-only"
              required={type === "employer" || type == null}
            />
            <span
              className={`w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 ${type == "employer" && "text-white"} rounded block ${type == "employer" && "bg-sky-600"} flex items-center justify-center`}
            >
              <i className="fa-solid fa-check scale-90 "></i>
            </span>
            Emloyer
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              name="type"
              onChange={() => setType("employee")}
              type="checkbox"
              value={type}
              className="peer sr-only"
              required={type === "employee" || type == null}
            />
            <span
              className={`w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 ${type == "employee" && "text-white"} rounded block ${type == "employee" && "bg-sky-600"} flex items-center justify-center`}
            >
              <i className="fa-solid fa-check scale-90"></i>
            </span>
            Emloyee
          </label>
        </div>*/}
        {warring === "don't exist" && (
          <p>
            {content.donhave}&nbsp;
            <span
              className="text-indigo-700 cursor-pointer"
              onClick={() => setOpen("signUp")}
            >
              {content.createOne}
            </span>
          </p>
        )}
        <button className="px-6 py-2 rounded-full bg-sky-600 hover:bg-[#0a2540] text-white font-medium cursor-pointer flex-none w-fit mb-4  mx-auto w-full">
          {content.logIn}
        </button>
      </form>
      <button>
        {content.notMemeber}&nbsp;
        <span
          className="text-indigo-700 cursor-pointer"
          onClick={() => setOpen("signUp")}
        >
          {content.signUp}
        </span>
      </button>
    </div>
  );
};

const Acount = () => {
  const [open, setOpen] = useState<string>("signUp");
  return (
    <div className="w-full h-screen md:px-8 flex justify-center items-center bg-[#f1f5f9]">
      <div className="flex flex-row max-w-2xl w-full shadow-lg shadow-gray-300 rounded-2xl">
        <div
          className="w-50 bg-cover flex-none block rounded-l-2xl bg-center"
          style={{
            backgroundImage:
              "url('/young-african-american-builder-man-wearing-construction-uniform-safety-helmet-holding-clipboard-pen-going-make-notes-with-friendly-smile-standing-blue.jpg')",
          }}
        ></div>
        {open == "signIn" ? (
          <SignIn setOpen={setOpen} />
        ) : (
          <SignUp setOpen={setOpen} />
        )}
      </div>
    </div>
  );
};

export default Acount;
