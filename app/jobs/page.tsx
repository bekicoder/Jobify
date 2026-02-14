"use client";
import Image from "next/image";
import React,{ FormEvent, useEffect, useState,SetStateAction, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "next/navigation";
import { proposalType } from "../interfaces"; 
import { job_detailsPanel,jobType } from "../interfaces";
import { useSharedState } from "../SharedStateContext";
import { stringify } from "querystring";
const JobDetailsPanel = ({
  proposal_ids,
  job,
  setJobdetail,
  proposals,
  setProposal_ids,
  saved_ids,
  setSaved_ids,
  setSavedJobs,
  approvals,
  setApprovals
}:job_detailsPanel) => {
  console.log(job,"this is the job")
  const [opend, setOpend] = useState<boolean>(false);
  const {lang} = useSharedState()
const {content} = useSharedState()
  const date = job.created_at.split(" ");
  const isSaved = saved_ids.some((s) => s == job.id);
  const proposal = proposals.find((p) => {
    return p.id == job.id;
  });
    const approval = approvals.find(a=>a.id == job.id)
    const approved = approval?.approval
    console.log(approval?.approval,"this is the approved",approvals,approval)
    const isApplied = proposal_ids.some(p=>Number(p) == Number(job.id))
    console.log(isApplied)
  const handleSave = async () => {
    setOpend(false)
    const save = await fetch("/api/saveJob", {
      method: "POST",
      cache:"no-store",
      body: JSON.stringify({ jobId: job.id, saved: isSaved }),
      headers: { "Content-Type": "application/json" },
    })
    const { msg, id: savedId, savedJob } = await save.json();
    alert(msg)
    if (msg == "successful") {
      setSaved_ids((prev) =>
        isSaved ? prev.filter((id) => id != job.id) : [Number(savedId), ...prev],
      )
      setSavedJobs((prev) =>
        isSaved ? prev.filter((p) => p.id != job.id) : [savedJob, ...prev],
      )
    }
  };

   
  
  function handleClose(){
    setJobdetail(null);
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement
    const fd = new FormData(target);
    const data = Object.fromEntries(fd.entries())
    const article = fd.get("article");
    const res = await fetch("/api/proposal", {
      method: "POST",
      cache:"no-store",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application" },
    });
    const _res = await res.json();
    if (_res.msg === "successful") {
      target.reset();
      setOpend(false);
      const data = await fetch(`/api/proposal?id=${_res.id}`,{cache:"no-store"});
      const updatedData = await data.json();
      setProposal_ids((prev) => [_res.id, ...prev]);
      setApprovals({id:job.id,approval:updatedData.data.approval});
      
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
              {content.write_proposal}
            </h1>{" "}
            <p className="text-center text-sm text-gray-600 mb-4">
              {content.markdown_suport}
            </p>
            <button
              onClick={() => setOpend(false)}
              className="absolute top-1 right-4 hover:bg-gray-300 w-8 h-8 rounded-full"
            >
              <i className="fa-solid fa-times"></i>
            </button>
            <input name="id" readOnly value={job.id} className="sr-only" />
            <input
              name="location"
              readOnly
              value={job['EnLocation']}
              className="sr-only"
            />
            <input
              name="posted_by"
              readOnly
              value={job.posted_by}
              className="sr-only"
            />
            <textarea
              placeholder="Enter proposal details..."
              name="article"
              className="w-full border rounded-xl resize-none p-4 max-h-full flex-1 focus:border-0 focus:outline-[1px]"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-sky-600  text-white font-medium cursor-pointer flex-none w-fit my-4 mx-auto"
            >
              {content.send}
            </button>
          </div>
        </form>
      )}

      <div className="w-full flex justify-between pr-4 pt-4">
        <button
          onClick={handleClose}
          className="py-2 cursor-pointer text-black w-10 h-10 flex justify-start"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <button
          onClick={handleSave}
          className="ml-auto mr-5 text-[18px] cursor-pointer fa-solid fa-regular"
        >
          <i
            className={`fa-bookmark ${isSaved ? "fa-solid" : "fa-regular"}`}
          ></i>
        </button>
        {isApplied && (
          <button
            disabled={isApplied ? true : false}
            onClick={() => setOpend(true)}
            className={`w-10 h-10 rounded-full bg-${approved == "approved" ? "green-500" : approved == "declined" ? "red-500" : approved == "pending" && "yellow-500"} ${!isApplied && "hover:bg-[#0a2540]"} text-white font-medium`}
          >
            <i
              className={`fa-solid fa-${approved == "approved" ? "thumbs-up" : approved == "declined" ? "thumbs-down" : approved == "pending" && "hourglass-half"}`}
            />
          </button>
        )}

        {!isApplied && (
          <button
            disabled={isApplied ? true : false}
            onClick={(e) => setOpend(true)}
            className={`px-6 rounded-full bg-sky-600 && "hover:bg-[#0a2540]" text-white font-medium`}
          >
            {content.apply}
          </button>
        )}
      </div>
      {/* job title */}
      <h1 className="text-2xl font-medium mb-2">{job.title}</h1>
      <div className="w-full flex justify-between pr-4">
        <span className=" text-sm flex items-center font-medium text-gray-600">
          {job.salary_range} • {job[`${lang}Location`]}&nbsp;&nbsp;&nbsp;{" "}
          <div className="aspect-video w-6 relative">
            {
              <Image
                src={job.flag}
                alt={job[`${lang}Location`] + " flag"}
                fill
                sizes="20px"
                className={`object-contain ${opend && "hidden"}`}
              />
            }
          </div>
          &nbsp;&nbsp;• {job[`${lang}Jobtype`]} &nbsp;&nbsp;
          <span
            className={`w-2 h-2 rounded-full block ${!proposal?.seenstatus && approved ? "bg-yellow-500" : approved && "bg-green-500"} my-auto mt-2 `}
          ></span>
        </span>
        <span className="text-sm">
          <i className="fa-solid fa-calendar-day text-gray-500" /> {date[0]}
        </span>
      </div>

      <h3 className="text-xl font-medium mt-8 mb-1 text-slate-800">
        {content.aboutJob}
      </h3>
      <article className="prose lg:prose-l prose-slate max-h-full flex-1 mb-16">
        <ReactMarkdown>{job[`detail${lang}`]}</ReactMarkdown>
        {/*bottom space */}
        <div className="w-full h-12"></div>
      </article>
    </div>
  );
};

const EmployeePage = () => {
  const searchParams = useSearchParams();
  const route = searchParams.get("route");
  const {content,jobCategories,jobTypes,countries} = useSharedState()
  const [_jobs, setJobs] = useState<jobType[]>([]);

  // type JobCategory = {
  //   id: number;
  //   title: string;
  // };

  // type locations = {
  //   id: number;
  //   name: string;
  //   flag: string;
  // };
  // const {} = useSharedState()

  // type job_types = {
  //   id: number;
  //   name: string;
  // };

  // const jobTypes: job_types[] = [
  //   { id: 1, name: "Full-time" },
  //   { id: 2, name: "Part-time" },
  //   { id: 3, name: "Contract" },
  //   { id: 4, name: "Temporary" },
  //   { id: 5, name: "Internship" },
  //   { id: 6, name: "Freelance" },
  //   { id: 7, name: "Remote" },
  //   { id: 8, name: "Hybrid" },
  //   { id: 9, name: "On-site" },
  //   { id: 10, name: "Seasonal" },
  //   { id: 11, name: "Volunteer" },
  //   { id: 12, name: "Apprenticeship" },
  // ];

  type income_range = {
    id: number;
    label: string;
  };
  const incomeRanges: income_range[] = [
    { id: 1, label: `${content.below} $500` },
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
  const [selectedJob, setJobdetail] = useState<number | null>(null);
  const [proposals, setProposals] = useState([]);
  const [proposal_ids, setProposal_ids] = useState<number[]>([]);
  const [savedJobs, setSavedJobs] = useState<jobType[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<jobType[]>([]);
  const [saved_ids, setSaved_ids] = useState<number[]>([]);
  const {lang} = useSharedState()
  const [approvals,setApprovals] = useState<Record<string,string|number>[]>([])
  const [selectedJ,setSelectedJ] = useState({
    id: 0,
    catagory: "",
    created_at: "",
    detail: "",
    flag: "",
    jobtype: "",
    location: "",
    posted_by: "",
    salary_range: "",
    title:"",
    updated_at:"",
  })
  function toggleMenu(menu: string) {
    if (openedMenu == menu) {
      setOpenedMenu(null);
    } else {
      setOpenedMenu(menu);
    }
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJobdetail(null);
  }, [route]);

  function toggleCheckbox(type: string, id: number) {
    if (type == "catagory") {
      setCatagories((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  }

  useEffect(() => {
    const fethJobs = async () => {
      const jobCount = await fetch("/api/jobs",{cache:"no-store"});
      const { count } = await jobCount.json();
      const jobs_: jobType[] = [];
      for (let i = 1; i <= count; i++) {
        const res = await fetch("/api/jobs", {
          method: "POST",
          body: JSON.stringify({ id: i }), 
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })
        const job = await res.json();
        jobs_.unshift(job.jobData);
      }
      setJobs(jobs_);
      const prop_res = await fetch("/api/proposal/?role=employee", {
        cache: "no-store",
      })
      const props = await prop_res.json();
      const proposalIds: number[] = [];
      const approved:Record<string,string | number>[] = []
      const fullProposal = props.data.map((p: Record<string, string | number>) => {
        approved.unshift({id:Number(p.career_id),approval:String(p.approval)})
        proposalIds.unshift(Number(p.career_id));
        const career = jobs_.find((j) => j.id == Number(p.career_id));
        return {
          id: Number(p.career_id),
          career_owner: p.career_owner,
          created_at: p.created_at,
          name: p.name,
          seenstatus:p.seenstatus,
          approval:p.approval,
          detailAm: p?.amproposal,
          detailAr:p?.arproposal,
          detailFr:p?.frproposal,
          detailEn:p?.enproposal,
          sender: p.sender,
          senderlocen: p?.senderlocen,
          senderlocam: p?.senderlocam,
          senderlocar: p?.senderlocar,
          senderlocfr: p?.senderlocfr,
          AmJobtype:career?.AmJobtype,
          ArJobtype:career?.ArJobtype,
          EnJobtype:career?.EnJobtype,
          FrJobtype:career?.FrJobtype,
          flag: career?.flag,
          titleam: career?.titleAm,
          titleen: career?.titleEn,
          titlefr: career?.titleFr,
          titlear: career?.titleAr,
          salary_range:career?.salary_range
        };
      });
      console.log(approved,"this is approved hi beki are you fine")
      setProposal_ids(proposalIds);
      setProposals(fullProposal);
      setApprovals(approved)
    };
    const fetchSaved = async () => {
      const savedRes = await fetch("/api/saveJob",{cache:"no-store"});
      const { data } = await savedRes.json();
      if(!data)return;
      data.forEach((d:Record<string,string | number>) => {
        setSaved_ids((prev) => [...prev, Number(d.id)]);
      });
      setSavedJobs(data);
    };
    fetchSaved();
    fethJobs();
  },[]);
  function handleFilter(filterType: string, option: string, status: boolean) {
    if (!option || !filterType) return;
    setFilteredJobs((prev) => {
      if (status) {
        // ADD filter
        return [
          ..._jobs.filter((j) => j[filterType] === option && !prev.includes(j)),
          ...prev,
        ];
      } else {
        // REMOVE filter

        return prev.filter((j) => j[filterType] !== option);
      }
    });
  }
  function handleSearch(e){

  }
  const jobsToRender = filteredJobs.length > 0 ? filteredJobs : _jobs;

  useEffect(()=>{
    let selected ;
    if(route == "appliedJobs"){
      selected = proposals.find((j) => j.id == selectedJob)
    } 
    else {
      selected = _jobs.find((j) => j.id == selectedJob)
    }
       // eslint-disable-next-line react-hooks/set-state-in-effect
       if(selected) setSelectedJ(selected)
  },[selectedJob])
  return (
    <div className="w-full md:h-full pt-16 flex flex-col md:flex-row overflow-auto bg-[#f6f9fc] md:fixed">
      <aside
        className={`w-full h-full md:w-70 shadow-r-lg flex gap-5 flex-col md:rounded pb-12 bg-white ${(route == "appliedJobs" || route == "savedJobs") && "hidden"}`}
      >
        <h1 className="w-full py-3 h-fit bg-sky-600 text-white text-2xl text-center font-bold md:rounded-t">
          {content.headline}          
        </h1>
        <div className="px-3 flex gap-5 flex-col text-gray-700">
          <div className="flex rounded-2xl shadow-lg shadow-gray-300 overflow-hidden items-center pl-2 bg-[#f6f9fc]">
            <i className="fa-solid fa-search " />
            <input
              type="text"
              placeholder={content.jobSearchPlaceholder}
              className="w-full h-full py-2 px-3 focus:outline-0"
            />
          </div>
          {/*catagories filter */}
          <div className="relative flex rounded-xl item-center px-2 hover:bg-green-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2">
            <i className="fas fa-layer-group text-gray-500"></i>
            {content.categories}
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
                  >
                    <input
                      onChange={(e) => {
                        toggleCheckbox("catagory", job.id);
                        handleFilter("catagory", job.name, e.target.checked);
                      }}
                      type="checkbox"
                      value={job.name}
                      className="accent-sky-500 text-amber-50 peer sr-only"
                    />
                    <span className="w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 peer-checked:text-white rounded block peer-checked:bg-sky-600 flex items-center justify-center">
                      <i className="fa-solid fa-check scale-90"></i>
                    </span>
                    {job.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* location filter*/}
          <div className="relative flex rounded-xl item-center px-2 hover:bg-yellow-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2">
            <i className="fa-solid fa-map-marker-alt text-gray-500" />
            {content.location}
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
                      onChange={(e) => {
                        toggleCheckbox("catagory", c.id);
                        handleFilter(`${lang}Location`, c.name, e.target.checked);
                      }}
                      type="checkbox"
                      value={c.name}
                      className="accent-sky-500 text-amber-50 peer sr-only"
                    />
                    <span className="w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 peer-checked:text-white rounded block peer-checked:bg-sky-600 flex items-center justify-center">
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
          {/*job type filter */}
          <div className="relative cursor-pointer flex rounded-xl item-center px-2 hover:bg-red-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2">
            <i className="fa-solid fa-briefcase text-gray-500" />
            {content.jobType}
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
                      onChange={(e) => {
                        toggleCheckbox("catagory", t.id);
                        handleFilter(`${lang}Jobtype`, t.name, e.target.checked);
                      }}
                      type="checkbox"
                      value={t.name}
                      className="accent-sky-500 text-amber-50 peer sr-only"
                    />
                    <span className="w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 peer-checked:text-white rounded block peer-checked:bg-sky-600 flex items-center justify-center">
                      <i className="fa-solid fa-check scale-90 "></i>
                    </span>
                    {t.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          {/*salary filter */}
          <div className="relative cursor-pointer flex rounded-xl item-center px-2 hover:bg-cyan-100 bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2">
            <i className="fa-solid fa-dollar text-gray-500" />
            {content.salary}
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
                      onChange={(e) => {
                        toggleCheckbox("catagory", range.id);
                        handleFilter("salary_range", range.label, e.target.checked);
                      }}
                      type="checkbox"
                      value={range.label}
                      className="accent-sky-500 text-amber-50 peer sr-only"
                    />
                    <span className="w-4 h-4 aspect-square flex-none bg-sky-200 text-sky-200 peer-checked:text-white rounded block peer-checked:bg-sky-600 flex items-center justify-center">
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
              proposal_ids={proposal_ids}
              job={selectedJ} 
              setJobdetail={setJobdetail}
              approvals={approvals}
              setApprovals={setApprovals}
            />
          ) : (
            <>
              <table
                className={`w-full shadow-2xl rounded-2xl bg-white px-7 overflow-hidden`}
              >
                <thead className="border-b border-b-gray-300 px-7">
                  <tr>
                    <th className="text-left text-sm font-medium px-4 py-2">
                      {content.careers}
                    </th>
                    <th className="text-left text-sm font-medium px-4 py-2">
                      {content.location}
                    </th>
                    <th className="text-left text-sm font-medium px-4 py-2">
                      {content.jobType}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {route == null &&
                    jobsToRender.map((p, i) => (
                      <tr
                        onClick={() => {
                          setJobdetail(p.id);
                        }}
                        key={i}
                        className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="text-left text-sm px-4 py-2 text-indigo-500 font-medium">
                          {p[`title${lang}`]}
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
                          {p[`${lang}Location`]}
                        </td>
                        <td className="text-left text-sm px-4 py-1">
                          {p[`${lang}Jobtype`]}
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
                          {p[`title${lang.toLowerCase()}`]}
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
                          {p[`senderloc${lang.toLowerCase()}`]}
                        </td>
                        <td className="text-left text-sm px-4 py-1">
                          {p[`${lang}Jobtype`]}
                        </td>
                      </tr>
                    ))}
                  {route == "savedJobs" &&
                    savedJobs.map((p, i) => (
                      <tr
                        onClick={() => setJobdetail(p.id)}
                        key={i}
                        className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="text-left text-sm px-4 py-2 text-indigo-500 font-medium">
                          {p[`title${lang}`]}
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
                          {p[`${lang}Location`]}
                        </td>
                        <td className="text-left text-sm px-4 py-1">
                          {p[`${lang}Jobtype`]}
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

export default function Employee(){
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeePage/>
    </Suspense>
  )
};
