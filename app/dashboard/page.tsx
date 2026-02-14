"use client";
import React, {
  FormEvent,
  use,
  useEffect,
  useState,
  SetStateAction,
} from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Route } from "next/";
import { useSharedState } from "../SharedStateContext";
import {
  income_range,
  _Fd,
  _myjobsType,
  DetailsPanelType,
  _jobs,
  proposalType,
  createJobsParamsType,
} from "../interfaces";
import {
  categoriesEn,
  jobTypesEn,
  categoriesAm,
  jobTypesAm,
  categoriesAr,
  jobTypesAr,
  categoriesFr,
  jobTypesFr,
} from "../_components/contents";
const JobDetailsPanel = ({
  option,
  job,
  setJobdetail,
  setPage,
  setFd,
  setEdit,
}: DetailsPanelType) => {
  console.log(job);
  const [approval, setApproval] = useState<string>(job.approval);
  const [opend, setOpend] = useState<boolean>(false);
  const date = job.created_at.split(" ");
  const proposal = option === "proposal";
  const { content, lang } = useSharedState();
  const handleEdit = () => {
    setFd({
      Jobtype: job.Jobtype,
      category: job.category,
      title: job[`title${lang}`],
      detail: job[`detail${lang}`],
      salary_range: job.salary_range,
      EnCategory: job.EnCategory,
      FrCategory: job.FrCategory,
      ArCategory: job.ArCategory,
      AmCategory: job.AmCategory,
      EnJobType: job.EnJobtype,
      FrJobType: job.FrJobtype,
      ArJobType: job.ArJobtype,
      AmJobType: job.AmJobtype,
    });
    setPage("createJob");
    setJobdetail(null);
    setEdit(Number(job.id));
  };
  async function handleApproval(status: boolean) {
    const res = await fetch("/api/approval", {
      method: "POST",
      body: JSON.stringify({ status: status, jobId: job.propId }),
      headers: { "Content-Type": "application/json" },
    });
    const approval_res = await res.json();
    if (approval_res.msg == "successful") {
      setApproval(status ? "approved" : "declined");
    }
  }
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
            </h1>
            <p className="text-center text-sm text-gray-600 mb-4">
              {content.markdownSupport}
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
            <button className="px-6 py-2 rounded-full bg-sky-600 hover:bg-[#0a2540] text-white font-medium cursor-pointer flex-none w-fit my-4 mx-auto">
              {content.send}
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
        {proposal && (
          <div className="flex items-center gap-2">
            <button
              disabled={approval == "approved"}
              onClick={() => handleApproval(true)}
              className={`flex items-center justify-center w-10 h-10 rounded-full
               bg-green-500 ${approval != "approved" && "hover:bg-green-600 cursor-pointer"}
               transition duration-200 shadow-md ${approval == "declined" && "hidden"}`}
              title="Approve"
            >
              <i className="fa-solid fa-thumbs-up text-white text-sm"></i>
            </button>

            <button
              disabled={approval == "declined"}
              onClick={() => handleApproval(false)}
              className={`flex items-center justify-center w-10 h-10 rounded-full
               bg-red-500  ${approval != "declined" && "hover:bg-red-600 cursor-pointer"}
               transition duration-200 shadow-md ${approval == "approved" && "hidden"}`}
              title="Decline"
            >
              <i className="fa-solid fa-thumbs-down text-white text-sm"></i>
            </button>
          </div>
        )}
      </div>
      {/* job title */}
      <h1 className="text-2xl font-medium mb-2">{job.title}</h1>
      <div className="w-full flex justify-between pr-4">
        <span className=" text-sm flex items-center font-medium text-gray-600">
          {proposal ? job.name : job.salary_range} • {job.location}
          &nbsp;&nbsp;&nbsp;
          <Image
            width={20}
            height={20}
            src={job.flag}
            alt={job.name + " flag"}
            className="h-fit aspect-video"
          />
          &nbsp;&nbsp;{!proposal && " • " + job[`${lang}Jobtype`]}
        </span>
        <span className="text-sm">
          <i className="fa-solid fa-calendar-day text-gray-500" />
          {date[0].replaceAll("-", "/")}
        </span>
      </div>
      {proposal && <p className="text-sm  mt-1">{job.sender}</p>}
      <h3 className="text-xl font-medium mt-8 mb-1 text-slate-800">
        {content.aboutJob}
      </h3>
      <article className="prose lg:prose-l prose-slate max-h-full flex-1 mb-16">
        <ReactMarkdown>{job[`detail${lang}`]}</ReactMarkdown>
        <div className="w-full h-12"></div>
      </article>
    </div>
  );
};

const CreateJobs = ({
  fd,
  setFd,
  edit,
  setEdit,
  setMyjobs,
  setPage,
}: createJobsParamsType) => {
  const [openedMenu, setOpenedMenu] = useState<string | null>();

  const { jobTypes } = useSharedState();
  const { jobCategories } = useSharedState();
  const { content,lang } = useSharedState();
  const [selectedJt, setSelectedJt] = useState("");
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
  function toggleMenu(
    e:
      | React.FocusEvent<HTMLDivElement, Element>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
    menu: string,
  ) {
    if (e.type == "blur" || openedMenu == menu) {
      setOpenedMenu(null);
    } else {
      setOpenedMenu(menu);
    }
  }
  let disabled = false ;
  async function handleSumit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!disabled){
    const res = await fetch("/api/createJob", {
      body: JSON.stringify({ fd: fd, editId: edit }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json();
    const data_res = data.data;
    if(data_res.status == "successful"){
      
      setFd({
    title: "",
    detail: "",
    salary_range: "",
    EnCategory: "",
    FrCategory: "",
    ArCategory: "",
    AmCategory: "",
    EnJobType: "",
    FrJobType: "",
    ArJobType: "",
    AmJobType: "",
  })
  // eslint-disable-next-line react-hooks/immutability
  disabled = !disabled
    }
    console.log(data);
}
  }

  function handleChange(id: number, option: string) {
    const languages = ["En", "Am", "Fr", "Ar"];

    interface OptionType {
      id: number;
      name: string;
    }

    const options: { [key: string]: OptionType[] } = {
      categoriesEn: categoriesEn,
      jobTypesEn: jobTypesEn,
      categoriesAm: categoriesAm,
      jobTypesAm: jobTypesAm,
      categoriesFr: categoriesFr,
      jobTypesFr: jobTypesFr,
      categoriesAr: categoriesAr,
      jobTypesAr: jobTypesAr,
    };

    // Build all translations first
    const newTranslations: { [key: string]: string } = {};

    languages.forEach((lang) => {
      const keyName =
        option === "categories" ? `categories${lang}` : `jobTypes${lang}`;

      const stateKey =
        option === "categories" ? `${lang}Category` : `${lang}JobType`;

      const found = options[keyName]?.find((o) => o.id === id);
      if (lang == "En" && found) setSelectedJt(found?.name);

      if (found) {
        newTranslations[stateKey] = found.name;
      }
    });

    // Update fd once with all translations
    setFd((prev) => ({ ...prev, ...newTranslations }));
  }

  return (
    <form
      onSubmit={handleSumit}
      className="w-full px-4 pt-4 h-full bg-white md:rounded-2xl flex flex-col"
    >
      <h1 className="text-2xl font-bold text-center mb-1">
        {content.writeProposal}
      </h1>
      <p className="text-center text-sm text-gray-600 mb-4">
        {content.markdownSupport}
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
          {content.jobType}&nbsp;
          <i className="fa-solid fa-chevron-down mr-3 text-gray-500 ml-auto"></i>
          <input
            name="Job_type"
            value={fd.Jobtype}
            className="sr-only"
            readOnly
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
                    handleChange(t.id, "Jobtypes");
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                >
                  <span
                    className={`w-4 h-4 aspect-square ${fd[`${lang}JobType`] == t.name.trim() ? "bg-[#0ea5e9] text-white" : "bg-gray-200 text-gray-200"} flex-none rounded flex items-center justify-cente`}
                  >
                    <i className="fa-solid fa-check scale-90 ml-0.5"></i>
                  </span>
                  {t.name}
                </label>
              ))}
            </div>
          )}
        </div>
        {/* job category */}
        <div
          onClick={(e) => toggleMenu(e, "Job_catagories")}
          onBlur={(e) => toggleMenu(e, "Job_catagories")}
          tabIndex={0}
          className="p-2 relative rounded-lg bg-gray-100 flex items-center cursor-pointer flex-1"
        >
          <i className="fas fa-layer-group mr-2 text-gray-500"></i>
          {content.categories}
          <i className="fa-solid fa-chevron-down mr-3 text-gray-500 ml-auto"></i>
          <input
            name={content.categories}
            value={fd.category}
            className="sr-only"
            readOnly
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
                    handleChange(t.id, "categories");
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                >
                  <span
                    className={`w-4 h-4 aspect-square flex-none ${fd[`${lang}Category`] == t.name ? "bg-[#0ea5e9] text-white" : "bg-gray-200 text-gray-200"}  rounded flex items-center justify-cente`}
                  >
                    <i className="fa-solid fa-check scale-90 ml-0.5"></i>
                  </span>
                  {t.name}
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
          <i className="fas fa-sack-dollar mr-2 text-gray-500"></i>
          {content.salary}
          <i className="fa-solid fa-chevron-down mr-3 text-gray-500 ml-auto"></i>
          <input
            name="range"
            value={fd.range}
            className="sr-only"
            readOnly
            required
          />
          {openedMenu == "Income_range" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="filter-box z-1000 scale-95  absolute rounded-2xl shadow-lg w-full top-[calc(100%+10px)] h-50 bg-white left-0 p-3 flex flex-col gap-2 overflow-auto whitespace-nowrap"
            >
              {incomeRanges.map((t, i) => (
                <label
                  key={i}
                  onClick={(e) => {
                    setFd((prev) => ({ ...prev, salary_range: t.label }));
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                >
                  <span
                    className={`w-4 h-4 aspect-square flex-none rounded flex items-center justify-cente ${fd.salary_range == t.label ? "bg-[#0ea5e9] text-white" : "bg-gray-200 text-gray-200"}`}
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
        placeholder={content.title}
        className="w-full p-2 px-4 rounded-lg border mb-3"
        required
      />
      <textarea
        onChange={(e) => setFd((prev) => ({ ...prev, detail: e.target.value }))}
        name="detail"
        value={fd.detail}
        placeholder={content.proposalPlaceholder}
        className="w-full border rounded-xl resize-none p-4 max-h-full flex-1 focus:border-0 focus-outline-0.5 outline-sky-500"
        required
      ></textarea>
      <button
        type="submit"
        className="px-6 py-2 rounded-full bg-sky-600 hover:bg-[#0a2540] text-white font-medium cursor-pointer flex-none w-fit my-4 mx-auto"
      >
        {!edit ? content.create : content.edit}
      </button>
    </form>
  );
};

const Employer = () => {
  const [selectedJob, setJobdetail] = useState<number | null>(0);
  const [page, setPage] = useState<string | null>("proposals");
  const [jobs, setJobs] = useState<_jobs[]>([]);
  const [myJobs, setMyjobs] = useState<_myjobsType[]>([]);
  const [edit, setEdit] = useState<number | null>(null);
  const [proposals, setProposals] = useState([]);
  const [proposal_ids, setProposal_ids] = useState([]);
  const { content, lang } = useSharedState();
  const [fd, setFd] = useState({
    title: "",
    detail: "",
    salary_range: "",
    EnCategory: "",
    FrCategory: "",
    ArCategory: "",
    AmCategory: "",
    EnJobType: "",
    FrJobType: "",
    ArJobType: "",
    AmJobType: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const job_res = await fetch("/api/myJobs");
      const { resData } = await job_res.json();
      setMyjobs(resData);
      //fetch proposals
      const prop_res = await fetch("/api/proposal/?role=employer", {
        cache: "no-store",
      });
      const props = await prop_res.json();
      if (props.data.legth == 0) return;

      const fullProposal = props.data.map(
        (p: Record<string, string | number>) => {
          const proposed_job = resData.filter(
            (j: Record<string, string | number>) => {
              return j.id == Number(p.career_id);
            },
          );

          console.log(proposed_job,"hi beki this is the porposed job")
          return {
          id: Number(p.career_id),
          career_owner: p.career_owner,
          created_at: p.created_at,
          name: p.name,
          detailAm: p?.amproposal,
          detailAr:p?.arproposal,
          detailFr:p?.frproposal,
          detailEn:p?.enproposal,
          sender: p.sender,
          senderlocen: p?.senderlocen,
          senderlocam: p?.senderlocam,
          senderlocar: p?.senderlocar,
          senderlocfr: p?.senderlocfr,
          AmJobtype:proposed_job[0]?.AmJobtype,
          ArJobtype:proposed_job[0]?.ArJobtype,
          EnJobtype:proposed_job[0]?.EnJobtype,
          FrJobtype:proposed_job[0]?.FrJobtype,
          flag: proposed_job[0]?.flag,
          titleam: proposed_job[0]?.titleAm,
          titleen: proposed_job[0]?.titleEn,
          titlefr: proposed_job[0]?.titleFr,
          titlear: proposed_job[0]?.titleAr,
          approval: p.approval,
          seenstatus: p.seenstatus,
          propId:p.id
        };
        },
      );
      setProposals(fullProposal);
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
  }, []);

  async function handleSeen(jobid_: number, status: proposalType) {
    if (!status.seenstatus) {
      const seenRes = await fetch("/api/seenStatus", {
        method: "POST",
        body: JSON.stringify({ jobId: jobid_ }),
        headers: { "Content-Type": "application/json" },
      });
      const { msg } = await seenRes.json();
      console.log(msg,"this is the msg")
      if (msg !== "successful") {
      }
    }
  }
  return (
    <div className="w-full md:h-full pt-16 flex flex-col md:flex-row overflow-auto bg-[#f6f9fc] md:fixed">
      <aside className="w-full h-full md:w-70 shadow-r-lg flex gap-5 flex-col md:rounded pb-12 bg-white ">
        <h1 className="w-full py-3 h-fit bg-sky-600 text-white text-2xl text-center font-bold md:rounded-t">
          {content.headline}
        </h1>
        <div className="px-3 flex gap-5 flex-col text-gray-700">
          <div
            onClick={() => setPage("myJobs")}
            className="relative flex rounded-xl font-medium item-center px-2 hover:bg-green-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-clipboard-list"></i>
            {content.myJobs}
          </div>
          <div
            onClick={() => setPage("createJob")}
            className="relative flex rounded-xl font-medium item-center px-2 hover:bg-yellow-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-file-circle-plus"></i>
            {content.createJob}
          </div>
          <div
            onClick={() => setPage("proposals")}
            className="relative flex rounded-xl font-medium item-center px-2 hover:bg-yellow-100  bg-gray-100 items-center pl-2 bg-[#f6f9fc] py-2 gap-2"
          >
            <i className="fa-solid fa-file-lines"></i>
          {content.proposals}
          </div>
        </div>
      </aside>

      <div className="md:px-5 pb-5 w-full md:px-24 overflow-auto relative bg-gray-100 overflow-auto">
        {page == "createJob" && (
          <CreateJobs
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

        {page == "myJobs" && (
          <div className="w-full h-full">
            {selectedJob ? (
              <JobDetailsPanel
                setEdit={setEdit}
                job={myJobs[selectedJob - 1]}
                setJobdetail={setJobdetail}
                setPage={setPage}
                setFd={setFd}
                option={""}
              />
            ) : (
              <>
                <table className="w-full shadow-2xl rounded-2xl bg-white px-7 overflow-hidden">
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
                    {myJobs.map((p: _myjobsType, i) => (
                      <tr
                        onClick={() => {
                          setJobdetail(i + 1);
                        }}
                        key={i}
                        className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="text-left text-sm px-4 py-2 text-indigo-500 font-medium">
                          {p[`title${lang}`]}
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
                          }
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
        )}

        {page == "proposals" && (
          <div className="w-full h-full">
            {selectedJob ? (
              <JobDetailsPanel
                option="proposal"
                job={proposals[selectedJob - 1]}
                setJobdetail={setJobdetail}
                setPage={setPage}
                setFd={setFd}
                setEdit={setEdit}
              />
            ) : (
              <>
                <table className="w-full shadow-2xl rounded-2xl bg-white px-7 overflow-hidden">
                  <thead className="border-b border-b-gray-300 px-7">
                    <tr>{console.log(proposals,"dose this work")}
                      <th className="text-left text-sm font-medium px-4 py-2">
                        {content.name}
                      </th>
                      <th className="text-left text-sm font-medium px-4 py-2">
                        {content.location}
                      </th>
                      <th className="text-left text-sm font-medium px-4 py-2">
                        {content.careers}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map((p: proposalType, i) => (
                      <tr
                        onClick={() => {
                          setJobdetail(i + 1);
                          handleSeen(p.propId, p);
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
                              alt={p[`senderloc${lang.toLowerCase()}`] + " flag"}
                              className="h-fit aspect-video"
                            />
                          }
                          {p[`senderloc${lang.toLowerCase()}`]}
                        </td>
                        <td className="text-left text-sm px-4 py-1">
                          {p[`title${lang.toLowerCase()}`]}
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
