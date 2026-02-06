"use client";
import { FormEvent, use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Route } from "next/";
const JobDetailsPanel = ({
  option,
  job,
  setJobdetail,
  setPage,
  setFd,
  setEdit,
}) => {
  const [opend, setOpend] = useState<boolean>(false);
  const date = job.created_at.split(" ");
  const proposal = option === "proposal";
  console.log("hi bekam why", job);
  const handleEdit = () => {
    setFd({
      jobType: job.jobtype,
      catagory: job.catagory,
      range: job.salary_range,
      detail: job.detail,
      title: job.title,
    });
    setPage("createJob");
    setJobdetail(null);
    setEdit(job.id);
    console.log("make sure", job);
  };
  return (
    <div className="w-full pl-12 h-full md:h-[calc(100vh-5rem)] rounded-2xl bg-white overflow-y-auto">
      {/*proposal form */}
      {opend && (
        <div
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
            <textarea
              placeholder="Enter proposal details..."
              className="w-full border rounded-xl resize-none p-4 max-h-full flex-1 focus:border-0 focus-outline-0.5 outline-sky-500"
            ></textarea>
            <button className="px-6 py-2 rounded-full bg-sky-500 hover:bg-[#0a2540] text-white font-medium cursor-pointer flex-none w-fit my-4 mx-auto">
              Send
            </button>
          </div>
        </div>
      )}

      <div className="w-full flex justify-between pr-4 pt-4">
        <button
          onClick={() => setJobdetail(null)}
          className="py-2 cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        {!proposal && (
          <button
            onClick={handleEdit}
            className="ml-auto mr-5 text-[18px] cursor-pointer"
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
        )}
      </div>
      {/* job title */}
      <h1 className="text-2xl font-medium mb-2">{job.title}</h1>
      <div className="w-full flex justify-between pr-4">
        <span className=" text-sm flex items-center font-medium text-gray-600">
          {proposal ? job.name : job.salary_range} • {job.location}
          &nbsp;&nbsp;&nbsp;{" "}
          <Image
            width={20}
            height={20}
            src={job.flag}
            alt={job.name + " flag"}
            className="h-fit aspect-video"
          />{" "}
          &nbsp;&nbsp;{!proposal && " • " + job.jobtype}
        </span>
        <span className="text-sm">
          <i className="fa-solid fa-calendar-day text-gray-500" />{" "}
          {date[0].replaceAll("-", "/")}{" "}
        </span>
      </div>
      {proposal && <p className="text-sm  mt-1">{job.sender}</p>}
      <h3 className="text-xl font-medium mt-8 mb-1 text-slate-800">
        About the Job
      </h3>
      <article className="prose lg:prose-l prose-slate max-h-full flex-1 mb-16">
        <ReactMarkdown>{job.detail}</ReactMarkdown>
        <div className="w-full h-12"></div>
      </article>
    </div>
  );
};

const CreateJobs = ({
  setjobs,
  fd,
  setFd,
  edit,
  setEdit,
  setMyjobs,
  setPage,
  setJobdetail,
  myJobs,
}) => {
  let [openedMenu, setOpenedMenu] = useState<string | null>();

  //job types
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
  //job catagories
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
  // job salary
  type income_range = {
    id: number;
    label: string;
  };
  //create incomeRanges
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
  function toggleMenu(e: React.MouseEvent<HTMLElement>, menu: string) {
    if (e.type == "blur" || openedMenu == menu) {
      setOpenedMenu(null);
    } else {
      setOpenedMenu(menu);
    }
  }
  type _fd = {
    jobType: string;
    catagory: string;
    range: string;
    detail: string;
    title: string;
  };
  async function handleSumit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/createJob", {
      body: JSON.stringify({ data: fd, editId: edit }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json();
    const data_res = data.data;
    if (data.status == "successful") {
      console.log("edit is true",edit,data_res)
      setFd({ jobType: "", catagory: "", range: "", detail: "", title: "" });
      setEdit(null);
      console.log(data.data)
      /*const fetchMyjobs = async () => {
        console.log(data.message);
        const job_res = await fetch(`/api/myJobs?id=${data.message}`);
        const _Myjobs = await job_res.json();
        const updatedData = _Myjobs.data;
        console.log("hi", updatedData);
        //fetch proposals
        setMyjobs((prev) =>
          prev.map((j, i) =>
            j.id === updatedData.id ? { ...j, ...updatedData } : j,
          ),
        );
        const index = myJobs.findIndex((j) => j.id === updatedData.id);
        console.log(index);
        setJobdetail(index + 1);
        setPage("myJobs");
      };
      fetchMyjobs();*/
    
       if(edit){
        setMyjobs((prev) =>
          prev.map((j, i) =>
            j.id === data_res.id ? { ...j, ...data_res } : j,
          ),
        ) 
      }else{
        setMyjobs((prev:[]) =>[...prev,data_res])
      }
      setPage("myJobs")
    }
    
  }

  return (
    <form
      onSubmit={handleSumit}
      className="w-full px-4 pt-4 h-full bg-white md:rounded-2xl flex flex-col"
    >
      <h1 className="text-2xl font-bold text-center mb-1">Write Job Detail</h1>{" "}
      <p className="text-center text-sm text-gray-600 mb-4">
        Markdown formatting supported
      </p>
      <div className="flex w-full flex-col gap-3 mb-4 font-medium text-gray-700 md:flex-row md:justify-between">
        {/* job type */}
        <div
          onClick={(e) => toggleMenu(e, "Job_type")}
          onBlur={(e) => toggleMenu(e, "Job_type")}
          tabIndex={0}
          className="p-2 tabin relative rounded-lg bg-gray-100 flex items-center cursor-pointer flex-1"
        >
          <i className="fa-solid fa-briefcase mr-2 text-gray-500" />
          Job type{" "}
          <i className="fa-solid fa-chevron-down mr-3 text-gray-500 ml-auto"></i>
          <input
            name="Job_type"
            value={fd.jobType}
            className="sr-only"
            required
          />
          {openedMenu == "Job_type" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="filter-box z-1000 scale-95  absolute rounded-2xl shadow-lg w-full top-[calc(100%+10px)] h-50 bg-white left-0 p-3 flex flex-col gap-2 overflow-auto whitespace-nowrap"
            >
              {jobTypes.map((t, i) => (
                <label
                  key={i}
                  onClick={(e) => {
                    setFd((prev) => ({ ...prev, jobType: t.name }));
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                >
                  <span
                    className={`w-4 h-4 aspect-square flex-none bg-gray-200 opacity-0  rounded flex items-center justify-cente`}
                    style={{
                      backgroundColor:
                        fd.jobType === t.name ? "#0ea5e9" : undefined,
                      opacity: fd.jobType === t.name ? 1 : 0,
                    }}
                  >
                    <i className="fa-solid fa-check scale-90 ml-0.5"></i>
                  </span>
                  {t.name}
                </label>
              ))}
            </div>
          )}
        </div>
        {/* job catagory */}
        <div
          onClick={(e) => toggleMenu(e, "Job_catagories")}
          onBlur={(e) => toggleMenu(e, "Job_catagories")}
          tabIndex={0}
          className="p-2 relative rounded-lg bg-gray-100 flex items-center cursor-pointer flex-1"
        >
          <i className="fas fa-layer-group mr-2 text-gray-500"></i>Cataory{" "}
          <i className="fa-solid fa-chevron-down mr-3 text-gray-500 ml-auto"></i>
          <input
            name="catagory"
            value={fd.catagory}
            className="sr-only"
            required
          />
          {openedMenu == "Job_catagories" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="filter-box z-1000 scale-95  absolute rounded-2xl shadow-lg w-full top-[calc(100%+10px)] h-50 bg-white left-0 p-3 flex flex-col gap-2 overflow-auto whitespace-nowrap"
            >
              {jobCategories.map((t, i) => (
                <label
                  key={i}
                  onClick={(e) => {
                    setFd((prev) => ({ ...prev, catagory: t.title }));
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                >
                  <span
                    className={`w-4 h-4 aspect-square flex-none bg-gray-200 opacity-0  rounded flex items-center justify-cente`}
                    style={{
                      backgroundColor:
                        fd.catagory === t.title ? "#0ea5e9" : undefined,
                      opacity: fd.catagory === t.title ? 1 : 0,
                    }}
                  >
                    <i className="fa-solid fa-check scale-90 ml-0.5"></i>
                  </span>
                  {t.title}
                </label>
              ))}
            </div>
          )}
        </div>
        {/* job salary */}
        <div
          onClick={(e) => toggleMenu(e, "Income_range")}
          onBlur={(e) => toggleMenu(e, "Income_range")}
          tabIndex={0}
          className="p-2 relative rounded-lg bg-gray-100 flex items-center cursor-pointer flex-1"
        >
          <i className="fas fa-sack-dollar mr-2 text-gray-500"></i>Sallary Range{" "}
          <i className="fa-solid fa-chevron-down mr-3 text-gray-500 ml-auto"></i>
          <input name="range" value={fd.range} className="sr-only" required />
          {openedMenu == "Income_range" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="filter-box z-1000 scale-95  absolute rounded-2xl shadow-lg w-full top-[calc(100%+10px)] h-50 bg-white left-0 p-3 flex flex-col gap-2 overflow-auto whitespace-nowrap"
            >
              {incomeRanges.map((t, i) => (
                <label
                  key={i}
                  onClick={(e) => {
                    setFd((prev) => ({ ...prev, range: t.label }));
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                >
                  <span
                    className={`w-4 h-4 aspect-square flex-none bg-gray-200 opacity-0  rounded flex items-center justify-cente`}
                    style={{
                      backgroundColor:
                        fd.range === t.label ? "#0ea5e9" : undefined,
                      opacity: fd.range === t.label ? 1 : 0,
                    }}
                  >
                    <i className="fa-solid fa-check scale-90 ml-0.5"></i>
                  </span>
                  {t.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <input
        onChange={(e) => setFd((prev) => ({ ...prev, title: e.target.value }))}
        value={fd.title}
        name="title"
        placeholder="Title"
        className="w-full p-2 px-4 rounded-lg border mb-3"
        required
      />
      <textarea
        onChange={(e) => setFd((prev) => ({ ...prev, detail: e.target.value }))}
        name="detail"
        value={fd.detail}
        placeholder="Enter proposal details..."
        className="w-full border rounded-xl resize-none p-4 max-h-full flex-1 focus:border-0 focus-outline-0.5 outline-sky-500"
        required
      ></textarea>
      <button
        type="submit"
        className="px-6 py-2 rounded-full bg-sky-500 hover:bg-[#0a2540] text-white font-medium cursor-pointer flex-none w-fit my-4 mx-auto"
      >
        {!edit ? "Create" : "Edit"}
      </button>
    </form>
  );
};

const Employer = () => {
  const [selectedJob, setJobdetail] = useState<number | null>(0);
  type _jobs = {
    id: number;
    title: string;
    location: string;
    jobType: string;
    flag: string;
    created_at: string;
    category: string;
    salary_range: string;
    detail: string;
  };
  const [page, setPage] = useState<string | null>("proposals");
  const [jobs, setJobs] = useState<_jobs[]>([]);
  const [myJobs, setMyjobs] = useState([]);
  const [edit, setEdit] = useState<number | null>(null);
  const [proposals, setProposals] = useState([]);
  const [proposal_ids, setProposal_ids] = useState([]);
  const [fd, setFd] = useState<_fd>({
    jobType: "",
    catagory: "",
    range: "",
    detail: "",
    title: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const job_res = await fetch("/api/myJobs");
      const _Myjobs = await job_res.json();
      //fetch proposals
      const prop_res = await fetch("/api/proposal/?role=employer", {
        cache: "no-store",
      });
      const props = await prop_res.json();
      const fullProposal = props.data.map((p) => {
      const proposed_job = _Myjobs.data.filter((j)=>{return j.id == p.career_id})
        return {
          id: p.career_id,
          career_owner: p.career_owner,
          created_at: p.created_at,
          name: p.name,
          detail: p.proposal,
          sender: p.sender,
          location: p.sender_location,
          flag: p.sender_flag,
          title: proposed_job[0].title,
        };
      });
      setProposals(fullProposal);
      setMyjobs(_Myjobs.data);
    };

    /* const fetchProposals = async()=>{
      const res = await fetch("/api/proposal/?role=employer",{cache:"no-store"})
      const _res = await res.json()
      setProposals(_res.data)
      _res.data.forEach((p)=>{
        setProposal_ids((prev)=>[...prev,p.career_id])
      })
    }
    fetchProposals() */

    fetchData();
  },[]);
  return (
    <div className="w-full md:h-full pt-16 flex flex-col md:flex-row overflow-auto bg-[#f6f9fc] md:fixed">
      <aside className="w-full h-full md:w-70 shadow-r-lg flex gap-5 flex-col md:rounded pb-12 bg-white ">
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
          <div
            onClick={() => setPage("dashboard")}
            className="relative flex rounded-xl font-medium item-center px-2 hover:bg-green-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-gauge"></i>
            Dashboard
          </div>
          <div
            onClick={() => setPage("myJobs")}
            className="relative flex rounded-xl font-medium item-center px-2 hover:bg-green-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-clipboard-list"></i>
            My Jobs
          </div>
          <div
            onClick={() => setPage("createJob")}
            className="relative flex rounded-xl font-medium item-center px-2 hover:bg-yellow-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-file-circle-plus"></i>
            Create Job
          </div>
          <div
            onClick={() => setPage("proposals")}
            className="relative flex rounded-xl font-medium item-center px-2 hover:bg-yellow-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-file-lines"></i>
            Proposals
          </div>
        </div>
      </aside>

      <div className="md:px-5 pb-5 w-full md:px-24 overflow-auto relative bg-gray-100 overflow-auto">
        {page == "createJob" && (
          <CreateJobs
            myJobs={myJobs}
            setJobdetail={setJobdetail}
            setPage={setPage}
            setMyjobs={setMyjobs}
            setjobs={setJobs}
            fd={fd}
            setFd={setFd}
            edit={edit}
            setEdit={setEdit}
          />
        )}
        {/*page == "proposals" && <div className="w-full">
    
               {selectedJob ? <JobDetailsPanel job={jobs[selectedJob-1]} setJobdetail={setJobdetail}/> : (
                <>
                <table className="w-full shadow-2xl rounded-2xl bg-white px-7 overflow-hidden">
                
                <thead className="border-b border-b-gray-300 px-7">
                    <tr>
                        <th className="text-left text-sm font-medium px-4 py-2">Careers</th>
                        <th className="text-left text-sm font-medium px-4 py-2">Location</th>
                        <th className="text-left text-sm font-medium px-4 py-2">Job Type</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        jobs.map((p,i)=>(
                            <tr onClick={()=>setJobdetail(p.id)} key={i} className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer">
                               <td className="text-left text-sm px-4 py-2 text-indigo-500 font-medium">{p.career}</td>
                               <td className="text-left text-sm px-4 py-2 flex items-center gap-2">{<Image width={20} height={20} src={p.flag} alt={p.location + " flag"} className="h-fit aspect-video"/>} {p.location}</td>
                               <td className="text-left text-sm px-4 py-1">{p.jobType}</td>
                            </tr>
                        ))
                    }
                    
                </tbody>
                </table>
    
                <div className="flex justify-center mt-5 text-[18px] font-medium text-indigo-500 gap-4 cursor-pointer">
                <a>1</a>
                <a>2</a>
                <a>3</a>
                <a className=" w-8 bg-sky-500 text-white h-8 rounded-full flex pt-0.5 justify-center">4</a>
                <a>5</a>
                <a>6</a>
                <a>7</a>
                <a>8</a>
                <button className="text-black">Next</button>
                </div>
                </>
                
               )
                }
                </div> */}
        {page == "myJobs" && (
          <div className="w-full h-full">
            {selectedJob ? (
              <JobDetailsPanel
                setEdit={setEdit}
                job={myJobs[selectedJob - 1]}
                setJobdetail={setJobdetail}
                setPage={setPage}
                setFd={setFd}
              />
            ) : (
              <>
                <table className="w-full shadow-2xl rounded-2xl bg-white px-7 overflow-hidden">
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
                    {myJobs.map((p, i) => (
                      <tr
                        onClick={() => {
                          setJobdetail(i + 1);
                          console.log("hi this is checkup", i);
                        }}
                        key={i}
                        className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="text-left text-sm px-4 py-2 text-indigo-500 font-medium">
                          {p.title}
                        </td>
                        <td className="text-left text-sm px-4 py-2 flex items-center gap-2">
                          {
                            <Image
                              width={20}
                              height={20}
                              src={p.flag}
                              alt={p.location + " flag"}
                              className="h-fit aspect-video"
                            />
                          }{" "}
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
        )}

        {page == "proposals" && (
          <div className="w-full h-full">
            {selectedJob ? (
              <JobDetailsPanel
                option="proposal"
                job={proposals[selectedJob - 1]}
                setJobdetail={setJobdetail}
                setPage={setPage}
              />
            ) : (
              <>
                <table className="w-full shadow-2xl rounded-2xl bg-white px-7 overflow-hidden">
                  <thead className="border-b border-b-gray-300 px-7">
                    <tr>
                      <th className="text-left text-sm font-medium px-4 py-2">
                        Name
                      </th>
                      <th className="text-left text-sm font-medium px-4 py-2">
                        Location
                      </th>
                      <th className="text-left text-sm font-medium px-4 py-2">
                        Career
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map((p, i) => (
                      <tr
                        onClick={() => {
                          setJobdetail(i + 1);
                        }}
                        key={i}
                        className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="text-left text-sm px-4 py-2 text-indigo-500 font-medium">
                          {p.name}
                        </td>
                        <td className="text-left text-sm px-4 py-2 flex items-center gap-2">
                          {
                            <Image
                              width={20}
                              height={20}
                              src={p.flag}
                              alt={p.location + " flag"}
                              className="h-fit aspect-video"
                            />
                          }{" "}
                          {p.location}
                        </td>
                        <td className="text-left text-sm px-4 py-1">
                          {p.title}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employer;
