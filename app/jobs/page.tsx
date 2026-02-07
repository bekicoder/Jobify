"use client";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
const JobDetailsPanel = ({
  proposal_ids,
  job,
  setJobdetail,
  setProposals,
  proposals,
  setProposal_ids,
  saved_ids,
  setSaved_ids,
  setSavedJobs
}) => {
  const [opend, setOpend] = useState<boolean>(false);
  const date = job.created_at.split(" ");
  const [isSaved,setSaved] = useState<boolean>(saved_ids.some((s) => s == job.id));
  const handleSave = async () => {
    const save = await fetch("/api/saveJob", {
      method: "POST",
      body: JSON.stringify({ jobId: job.id,saved:isSaved }),
      headers: { "Content-Type": "application/json" },
    });
    const {msg,id:savedId,savedJob} =await save.json();
    console.log(job,msg,job.id)

    if (msg == "successful") {
      setSaved_ids(prev => prev.includes(savedId) ? prev.filter(id => id !== savedId) : [savedId,...prev]);
      setSavedJobs((prev)=>isSaved ? prev.filter(p=>p.id !== job.id) : [savedJob,...prev])
      setSaved(!isSaved)
    }
  };
  
  const [isApplied,setApplied] = useState();
  const appliedId = proposal_ids.some((p) => {
    return p == job.id;
  })
  useEffect(()=>{
    setApplied(appliedId)
  },[])
   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const article = fd.get("article");
    const res = await fetch("/api/proposal", {
      method: "POST",
      body: JSON.stringify({
        id: job.id,
        location: job.location,
        owner: job.posted_by,
        article: article,
      }),
      headers: { "Content-Type": "application" },
      cache: "no-store",
    });
    const _res = await res.json();
    if (_res.msg === "successful") {
      e.target.reset();
      setOpend(false);
      const data = await fetch(`/api/proposal?id=${_res.id}`);
      const updatedData = await data.json();
      setProposal_ids((prev) => [_res.id,...prev]);
      setApplied(_res.id)
    }
  }
  return (
    <div className="w-full z-100000 pl-12 h-full md:h-[calc(100vh-5rem)] rounded-2xl bg-white overflow-y-auto">
      {/*proposal form */}
      {opend && (
        <form
          onSubmit={(e) => handleSubmit(e)}
          onClick={(e) => e.currentTarget == e.target && setOpend(false)}
          className="proposal_container w-screen h-screen fixed top-0 py-12 px-8 pt-16 left-0 bg-black/50 flex items-center justify-center"
        >
          <div className="w-full p-4 h-full bg-white rounded-2xl max-w-2xl flex flex-col relative">
            <h1 className="text-2xl font-bold text-center mb-1">
              Write Proposal
            </h1>{" "}
            <p className="text-center text-sm text-gray-600 mb-4">
              Markdown formatting supported
            </p>
            <button
              onClick={() => setOpend(false)}
              className="absolute top-6 right-6 hover:bg-gray-300 w-8 h-8 rounded-full"
            >
              <i className="fa-solid fa-times"></i>
            </button>
            <input name="id" readOnly value={job.id} className="sr-only" />
            <input name="location" readOnly value={job.location} className="sr-only" />
            <input name="posted_by" readOnly value={job.posted_by} className="sr-only" />
            <textarea
              placeholder="Enter proposal details..."
              name="article"
              className="w-full border rounded-xl resize-none p-4 max-h-full flex-1 focus:border-0 focus-outline-0.5 outline-sky-500"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-sky-500  text-white font-medium cursor-pointer flex-none w-fit my-4 mx-auto"
            >
              Send
            </button>
          </div>
        </form>
      )}

      <div className="w-full flex justify-between pr-4 pt-4">
        <button
          onClick={() => setJobdetail(null)}
          className="py-2 cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <button
          onClick={handleSave}
          className="ml-auto mr-5 text-[18px] cursor-pointer"
        >
          <i
            className={`fa-bookmark ${isSaved ? "fa-solid" : "fa-regular"}`}
          ></i>
        </button>
        <button
          disabled={isApplied ? true : false}
          onClick={(e) => setOpend(true)}
          className={`px-6 rounded-full bg-sky-500 ${!isApplied && "hover:bg-[#0a2540]"} text-white font-medium`}
          style={{ cursor: isApplied ? "not-allowed" : "pointer" }}
        >
          {isApplied ? "Applied" : "Apply"}
        </button>
      </div>
      {/* job title */}
      <h1 className="text-2xl font-medium mb-2">{job.title}</h1>
      <div className="w-full flex justify-between pr-4">
        <span className=" text-sm flex items-center font-medium text-gray-600">
          {job.salary_range} • {job.location}&nbsp;&nbsp;&nbsp;{" "}
          <div className="aspect-video w-6 relative">
                            {
                            <Image
                              src={job.flag}
                              alt={job.location + " flag"}
                              fill
                              sizes="20px"
                              className={`object-contain ${opend && "hidden"}`}
                              
                            />
                          }
                            </div>{" "}
          &nbsp;&nbsp;• {job.jobtype}
        </span>
        <span className="text-sm">
          <i className="fa-solid fa-calendar-day text-gray-500" />{" "}
          {date[0]}
        </span>
      </div>

      <h3 className="text-xl font-medium mt-8 mb-1 text-slate-800">
        About the Job
      </h3>
      <article className="prose lg:prose-l prose-slate max-h-full flex-1 mb-16">
        <ReactMarkdown>{job.detail}</ReactMarkdown>
        {/*bottom space */}
        <div className="w-full h-12"></div>
      </article>
    </div>
  );
};

const Employee = () => {
  const searchParams = useSearchParams();
  const route = searchParams.get("route");
  type _jobs = {
    id: number;
    career: string;
    location: string;
    jobType: string;
    flag: string;
    releaseDate: string;
    category: string;
    income: string;
    details: string;
  };
  const [_jobs, setJobs] = useState([]);
  

  type JobCategory = {
    id: number;
    title: string;
  };
  const jobCategories: JobCategory[] = [
    { id: 1, title: "Healthcare & Medical" },
    { id: 2, title: "Information Technology (IT) & Software" },
    { id: 3, title: "Education & Teaching" },
    { id: 4, title: "Engineering & Technical" },
    { id: 5, title: "Finance & Accounting" },
    { id: 6, title: "Sales & Marketing" },
    { id: 7, title: "Human Resources & Administration" },
    { id: 8, title: "Creative & Design" },
    { id: 9, title: "Hospitality & Tourism" },
    { id: 10, title: "Manufacturing & Trades" },
  ];

  type locations = {
    id: number;
    name: string;
    flag: string;
  };
  const countries: locations[] = [
    { id: 1, name: "Argentina", flag: "https://flagcdn.com/w40/ar.png" },
    { id: 2, name: "Australia", flag: "https://flagcdn.com/w40/au.png" },
    { id: 3, name: "Austria", flag: "https://flagcdn.com/w40/at.png" },
    { id: 4, name: "Belgium", flag: "https://flagcdn.com/w40/be.png" },
    { id: 5, name: "Brazil", flag: "https://flagcdn.com/w40/br.png" },

    { id: 6, name: "Canada", flag: "https://flagcdn.com/w40/ca.png" },
    { id: 7, name: "China", flag: "https://flagcdn.com/w40/cn.png" },
    { id: 8, name: "Colombia", flag: "https://flagcdn.com/w40/co.png" },
    { id: 9, name: "Czech Republic", flag: "https://flagcdn.com/w40/cz.png" },
    { id: 10, name: "Denmark", flag: "https://flagcdn.com/w40/dk.png" },

    { id: 11, name: "Egypt", flag: "https://flagcdn.com/w40/eg.png" },
    { id: 12, name: "Ethiopia", flag: "https://flagcdn.com/w40/et.png" },
    { id: 13, name: "Finland", flag: "https://flagcdn.com/w40/fi.png" },
    { id: 14, name: "France", flag: "https://flagcdn.com/w40/fr.png" },
    { id: 15, name: "Germany", flag: "https://flagcdn.com/w40/de.png" },

    { id: 16, name: "Ghana", flag: "https://flagcdn.com/w40/gh.png" },
    { id: 17, name: "Greece", flag: "https://flagcdn.com/w40/gr.png" },
    { id: 18, name: "India", flag: "https://flagcdn.com/w40/in.png" },
    { id: 19, name: "Indonesia", flag: "https://flagcdn.com/w40/id.png" },
    { id: 20, name: "Ireland", flag: "https://flagcdn.com/w40/ie.png" },

    { id: 21, name: "Israel", flag: "https://flagcdn.com/w40/il.png" },
    { id: 22, name: "Italy", flag: "https://flagcdn.com/w40/it.png" },
    { id: 23, name: "Japan", flag: "https://flagcdn.com/w40/jp.png" },
    { id: 24, name: "Kenya", flag: "https://flagcdn.com/w40/ke.png" },
    { id: 25, name: "Malaysia", flag: "https://flagcdn.com/w40/my.png" },

    { id: 26, name: "Mexico", flag: "https://flagcdn.com/w40/mx.png" },
    { id: 27, name: "Morocco", flag: "https://flagcdn.com/w40/ma.png" },
    { id: 28, name: "Netherlands", flag: "https://flagcdn.com/w40/nl.png" },
    { id: 29, name: "New Zealand", flag: "https://flagcdn.com/w40/nz.png" },
    { id: 30, name: "Nigeria", flag: "https://flagcdn.com/w40/ng.png" },

    { id: 31, name: "Norway", flag: "https://flagcdn.com/w40/no.png" },
    { id: 32, name: "Pakistan", flag: "https://flagcdn.com/w40/pk.png" },
    { id: 33, name: "Philippines", flag: "https://flagcdn.com/w40/ph.png" },
    { id: 34, name: "Poland", flag: "https://flagcdn.com/w40/pl.png" },
    { id: 35, name: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },

    { id: 36, name: "Qatar", flag: "https://flagcdn.com/w40/qa.png" },
    { id: 37, name: "Romania", flag: "https://flagcdn.com/w40/ro.png" },
    { id: 38, name: "Saudi Arabia", flag: "https://flagcdn.com/w40/sa.png" },
    { id: 39, name: "South Africa", flag: "https://flagcdn.com/w40/za.png" },
    { id: 40, name: "South Korea", flag: "https://flagcdn.com/w40/kr.png" },

    { id: 41, name: "Spain", flag: "https://flagcdn.com/w40/es.png" },
    { id: 42, name: "Sweden", flag: "https://flagcdn.com/w40/se.png" },
    { id: 43, name: "Switzerland", flag: "https://flagcdn.com/w40/ch.png" },
    { id: 44, name: "Thailand", flag: "https://flagcdn.com/w40/th.png" },
    { id: 45, name: "Turkey", flag: "https://flagcdn.com/w40/tr.png" },

    { id: 46, name: "Ukraine", flag: "https://flagcdn.com/w40/ua.png" },
    {
      id: 47,
      name: "United Arab Emirates",
      flag: "https://flagcdn.com/w40/ae.png",
    },
    { id: 48, name: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png" },
    { id: 49, name: "United States", flag: "https://flagcdn.com/w40/us.png" },
    { id: 50, name: "Vietnam", flag: "https://flagcdn.com/w40/vn.png" },
  ];

  type job_types = {
    id: number;
    name: string;
  };

  const jobTypes: job_types[] = [
    { id: 1, name: "Full-time" },
    { id: 2, name: "Part-time" },
    { id: 3, name: "Contract" },
    { id: 4, name: "Temporary" },
    { id: 5, name: "Internship" },
    { id: 6, name: "Freelance" },
    { id: 7, name: "Remote" },
    { id: 8, name: "Hybrid" },
    { id: 9, name: "On-site" },
    { id: 10, name: "Seasonal" },
    { id: 11, name: "Volunteer" },
    { id: 12, name: "Apprenticeship" },
  ];

  type income_range = {
    id: number;
    label: string;
  };
  const incomeRanges: income_range[] = [
    { id: 1, label: "Below $500" },
    { id: 2, label: "$500 – $1,000" },
    { id: 3, label: "$1,000 – $2,000" },
    { id: 4, label: "$2,000 – $3,000" },
    { id: 5, label: "$3,000 – $5,000" },
    { id: 6, label: "$5,000 – $7,000" },
    { id: 7, label: "$7,000 – $10,000" },
    { id: 8, label: "$10,000+" },
  ];
  interface accountType {
    name: string;
    email: string;
    role: string;
    profile: string;
  }
  const [catagories, setCatagories] = useState<{ [key: number]: boolean }>({});
  const [openedMenu, setOpenedMenu] = useState<string | null>(null);
  const [selectedJob, setJobdetail] = useState<number | null>();
  const [account, setAccount] = useState<accountType | null>(null);
  const [proposals, setProposals] = useState([]);
  const [proposal_ids, setProposal_ids] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJob, setFilteredJob] = useState([]);
  const [fillteredIds,setFiltereIds] = useState<number[]>([])
  const [saved_ids, setSaved_ids] = useState<number[]>([]);
  
  function toggleMenu(menu: string) {
    if (openedMenu == menu) {
      setOpenedMenu(null);
    } else {
      setOpenedMenu(menu);
    }
  }
  useEffect(()=>{
    if(route == "appliedJobs" || route == "savedJobs" ) setJobdetail(null);
  },[route])

  function toggleCheckbox(type: string, id: number) {
    if (type == "catagory") {
      setCatagories((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  }

  useEffect(() => {
    const fethJobs = async () => {
  const jobCount = await fetch("/api/jobs");
  const { count } = await jobCount.json();
  const jobs_: any[] = [];
  for (let i = 1; i <= count; i++) {
    const res = await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify({ id: i }),
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const job = await res.json();
    jobs_.unshift(job);
  }

  // ✅ set once
  setJobs(jobs_);
  const prop_res = await fetch("/api/proposal/?role=employee", {
    cache: "no-store",
  });

  const props = await prop_res.json();

  const proposalIds: number[] = [];

  const fullProposal = props.data.map((p) => {
    proposalIds.unshift(p.career_id);
    
    const career = jobs_.find((j) => j.id == p.career_id);
    return {
      id: p.career_id,
      career_owner: p.career_owner,
      created_at: p.created_at,
      name: p.name,
      detail: p.proposal,
      sender: p.sender,
      location: p.sender_location,
      flag: career?.flag,
      title: career?.title,
    };
  });

  // ✅ set once
  setProposal_ids(proposalIds);
  setProposals(fullProposal);
};

    const fetchSaved =async()=>{
      const savedRes =await fetch("/api/saveJob")
      const {savedJobs,data} = await savedRes.json()
      console.log(savedJobs,"hi bekam ",data)
      savedJobs.forEach(s => {
        setSaved_ids((prev)=>[...prev,s.career_id])
      });

      setSavedJobs([...data])
    }
    fetchSaved()
    fethJobs();
  },[]);
      const filterd = []
  function handleFilter(filterType:string,option:string,status:boolean){
    console.log(status)
    if(!option || !filterType) return console.log("Invalid filter options");
     _jobs.forEach((j)=>{

        const isFiltered = fillteredIds.some((i)=>{ return i==j.id })
        if(!status){
        if(isFiltered || j[filterType] != option) return;
        console.log(j)
        setFiltereIds((prev)=>{return[j.id,...prev]})
        setFilteredJob((prev)=>{return [j,...prev]})
        filterd.push(j)
     } else {

     }
  })
  }

  return (
    <div className="w-full md:h-full pt-16 flex flex-col md:flex-row overflow-auto bg-[#f6f9fc] md:fixed">
      <aside
        className={`w-full h-full md:w-70 shadow-r-lg flex gap-5 flex-col md:rounded pb-12 bg-white ${(route == "appliedJobs" || route == "savedJobs") && "hidden"}`}
      >
        <h1 className="w-full py-3 h-fit bg-sky-500 text-white text-2xl text-center font-bold md:rounded-t">
          {" "}
          Land Your Job
        </h1>
        <div className="px-3 flex gap-5 flex-col text-gray-700">
          <div className="flex rounded-2xl shadow-lg shadow-gray-300 overflow-hidden items-center pl-2 bg-[#f6f9fc]">
            <i className="fa-solid fa-search " />
            <input
              type="text"
              placeholder="Search for job"
              className="w-full h-full py-2 px-3 focus:outline-0"
            />
          </div>
          {/*catagories filter */}
          <div className="relative flex rounded-xl item-center px-2 hover:bg-green-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2">
            <i className="fas fa-layer-group text-gray-500"></i>
            Catagories
            <button
              onClick={() => toggleMenu("Catagories")}
              className="cursor-pointer px-12 ml-auto"
            >
              <i
                className={`fa-solid ${openedMenu == "Catagories" ? "fa-chevron-up" : "fa-chevron-down"} ml-auto`}
              />
            </button>
            {openedMenu == "Catagories" && (
              <div className="cursor-default filter-box z-1000 scale-95  absolute rounded-2xl shadow-lg w-full top-[calc(100%+10px)] h-50 bg-white left-0 p-3 flex flex-col gap-2 overflow-auto whitespace-nowrap">
                {jobCategories.map((job, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                    onClick={()=>{handleFilter("catagory",job.title)}}
                  >
                    <input
                      onChange={(e) =>{ toggleCheckbox("catagory", job.id); handleFilter("catagory",job.title,e.target.checked)}}
                      type="checkbox"
                      value={job.title}
                      className="accent-sky-500 text-amber-50 peer sr-only"
                    />
                    <span className="w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 peer-checked:text-white rounded block peer-checked:bg-sky-500 flex items-center justify-center">
                      <i className="fa-solid fa-check scale-90"></i>
                    </span>
                    {job.title}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex rounded-xl item-center px-2 hover:bg-yellow-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2">
            <i className="fa-solid fa-map-marker-alt text-gray-500" />
            Location
            <button
              onClick={() => toggleMenu("Location")}
              className="cursor-pointer px-12 ml-auto"
            >
              <i
                className={`fa-solid ${openedMenu == "Location" ? "fa-chevron-up" : "fa-chevron-down"} ml-auto`}
              />
            </button>
            {openedMenu == "Location" && (
              <div className="filter-box z-1000 scale-95  absolute rounded-2xl shadow-lg w-full top-[calc(100%+10px)] h-50 bg-white left-0 p-3 flex flex-col gap-2 overflow-auto whitespace-nowrap">
                {countries.map((c, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                  >
                    <input
                      onChange={() => toggleCheckbox("catagory", c.id)}
                      type="checkbox"
                      value={c.name}
                      className="accent-sky-500 text-amber-50 peer sr-only"
                    />
                    <span className="w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 peer-checked:text-white rounded block peer-checked:bg-sky-500 flex items-center justify-center">
                      <i className="fa-solid fa-check scale-90 "></i>
                    </span>
                    <Image
                      width={20}
                      height={20}
                      src={c.flag}
                      alt={c.name + " flag"}
                      className="h-fit aspect-video"
                    />{" "}
                    {c.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative cursor-pointer flex rounded-xl item-center px-2 hover:bg-red-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2">
            <i className="fa-solid fa-briefcase text-gray-500" />
            Job Type
            <button
              onClick={() => toggleMenu("Job_type")}
              className="cursor-pointer px-12 ml-auto"
            >
              <i
                className={`fa-solid ${openedMenu == "Job_type" ? "fa-chevron-up" : "fa-chevron-down"} ml-auto`}
              />
            </button>
            {openedMenu == "Job_type" && (
              <div className="filter-box z-1000 scale-95  absolute rounded-2xl shadow-lg w-full bottom-[calc(100%+10px)] h-50 bg-white left-0 p-3 flex flex-col gap-2 overflow-auto whitespace-nowrap">
                {jobTypes.map((t, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                  >
                    <input
                      onChange={() => toggleCheckbox("catagory", t.id)}
                      type="checkbox"
                      value={t.title}
                      className="accent-sky-500 text-amber-50 peer sr-only"
                    />
                    <span className="w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 peer-checked:text-white rounded block peer-checked:bg-sky-500 flex items-center justify-center">
                      <i className="fa-solid fa-check scale-90 "></i>
                    </span>
                    {t.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative cursor-pointer flex rounded-xl item-center px-2 hover:bg-cyan-100 bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2">
            <i className="fa-solid fa-dollar text-gray-500" />
            Income
            <button
              onClick={() => toggleMenu("Income")}
              className="cursor-pointer px-12 ml-auto"
            >
              <i
                className={`fa-solid ${openedMenu == "Income" ? "fa-chevron-up" : "fa-chevron-down"} ml-auto`}
              />
            </button>
            {openedMenu == "Income" && (
              <div className="filter-box z-1000 scale-95  absolute rounded-2xl shadow-lg w-full bottom-[calc(100%+10px)] h-50 bg-white left-0 p-3 flex flex-col gap-2 overflow-auto whitespace-nowrap">
                {incomeRanges.map((range, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                  >
                    <input
                      onChange={() => toggleCheckbox("catagory", range.id)}
                      type="checkbox"
                      value={range.label}
                      className="accent-sky-500 text-amber-50 peer sr-only"
                    />
                    <span className="w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 peer-checked:text-white rounded block peer-checked:bg-sky-500 flex items-center justify-center">
                      <i className="fa-solid fa-check scale-90 "></i>
                    </span>
                    {range.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="px-5 w-full md:px-24 h-full overflow-auto relative">
        <div className="w-full h-full">
          {selectedJob ? (
            <JobDetailsPanel
             setSavedJobs={setSavedJobs}
              setSaved_ids={setSaved_ids}
              saved_ids={saved_ids}
              setProposal_ids={setProposal_ids}
              proposals={proposals}
              setProposals={setProposals}
              proposal_ids={proposal_ids}
              job={()=>_jobs.find((j)=>j.id==selectedJob)}
              setJobdetail={setJobdetail}
            />
          ) : (
            <>
              <table className={`w-full shadow-2xl rounded-2xl bg-white px-7 overflow-hidden`}>
                <thead className="border-b border-b-gray-300 px-7">
                  <tr>
                    <th className="text-left text-sm font-medium px-4 py-2">
                      Careers
                    </th>
                    <th className="text-left text-sm font-medium px-4 py-2">
                      Location
                    </th>
                    <th className="text-left text-sm font-medium px-4 py-2">
                      Job Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {route == null &&
                  
                    _jobs.map((p, i) => (
                        
                      <tr
                        onClick={() => setJobdetail(p.id)}
                        key={i}
                        className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >{console.log(p,p.id)}
                        <td className="text-left text-sm px-4 py-2 text-indigo-500 font-medium">
                          {p.title}
                        </td>
                        <td className="text-left text-sm px-4 py-2 flex items-center gap-2">
                          <div className="aspect-video w-5 relative">
                            {
                            <Image
                              src={p.flag}
                              alt={p.location + " flag"}
                              fill
                              sizes="20px"
                              className="object-contain"
                            />
                          }
                            </div>
                            {" "}
                          {p.location}
                        </td>
                        <td className="text-left text-sm px-4 py-1">
                          {p.jobtype}
                        </td>
                      </tr>
                    ))}

                  {route == "appliedJobs" &&
                    proposals.map((p, i) => (
                      <tr
                        onClick={() => setJobdetail(p.id)}
                        key={i}
                        className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="text-left text-sm px-4 py-2 text-indigo-500 font-medium">
                          {p.title}
                        </td>
                        <td className="text-left text-sm px-4 py-2 flex items-center gap-2">
                          <div className="aspect-video w-5 relative">
                            {
                                
                            <Image
                              src={p.flag}
                              alt={p.location + " flag"}
                              fill
                              sizes="20px"
                              className="object-contain"
                            />
                          }
                            </div>{" "}
                          {p.location}
                        </td>
                        <td className="text-left text-sm px-4 py-1">
                          {p.jobtype}
                        </td>
                      </tr>
                    ))}
                  {route == 'savedJobs' &&
                    savedJobs.map((p, i) => (
                      <tr
                        onClick={() => setJobdetail(p.id)}
                        key={i}
                        className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="text-left text-sm px-4 py-2 text-indigo-500 font-medium">
                          {p.title}
                        </td>
                        <td className="text-left text-sm px-4 py-2 flex items-center gap-2">
                          <div className="aspect-video w-5 relative">
                            {
                            <Image
                              src={p.flag}
                              alt={p.location + " flag"}
                              fill
                              sizes="20px"
                              className="object-contain"
                            />
                          }
                            </div>
                          {p.location}
                        </td>
                        <td className="text-left text-sm px-4 py-1">
                          {p.jobtype}
                        </td>
                      </tr>
                    ))}
                  
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employee;
