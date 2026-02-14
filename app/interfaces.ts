import { SetStateAction } from "react";
export default interface ContentType {
  myJobs: string;
    createJob: string;
    proposals: string;
    create: string;
    edit: string
  alreadySignedInMessage:string;
  organizationName:string;
  password: string;
  signUp: string;
  fname: string;
  lname: string;
  role: string;
  employee: string;
  employer: string;
  haveAccount: string;
  logIn: string;
  about: string;
  footer_about_paragraph: string;
  contact: string;
  email: string;
  phone: string;
  home_link: string;
  sent_link: string;
  saved_link: string;
  explore_link: string;
  dashboard_link: string;
  find_job: string;
  hero_header: string;
  hero_paragraph:string;
  job_posted: string;
  active_users: string;
  campany_amount: string;
  motive_header: string;
  motive_paragraph:string;
  about_us: string;
  about_paragraph:string;
  staf_header: string;
  footer_paragraph:string;
  links:string;
  categories:string;
  location:string;
  jobType:string;
  salary:string;
  jobSearchPlaceholder:string;
  proposalPlaceholder:string;
 writeProposal:string;
  markdownSupport:string;
  headline:string;
  careers:string;
  below:string;
  send:string;
  dashboard:string;
  workspace:string;
  inbox:string;
  name:string;
  post:string;
  team:string;
  aboutJob:string;
  signOut:string;
  jobDetails:string;
  title:string;
  language:string;
  apply:string;
  learn_more:string;
  right:string;
  donhave: string;
  createOne: string;
};
export interface income_range {
  id: number;
  label: string;
}
export interface _Fd {
  [key:string]:string
  title: string;
  detail: string;
  salary_range: string;

  EnCategory: string;
  FrCategory: string;
  ArCategory: string;
  AmCategory: string;

  EnJobType: string;
  FrJobType: string;
  ArJobType: string;
  AmJobType: string;
}
export interface _myjobsType {
  id: string;
  location: string;
  jobtype: string;
  flag: string;
  created_at: string;
  catagory: string;
  salary_range: string;
  detail: string;
  title: string;
  posted_by: string;
  updated_at: string;
  approval: string;
  name: string;
  career_owner: string;
  seenStatus: boolean;
  sender: string;
  career_id: string;
}
export interface DetailsPanelType {
  option: string;
  job: _myjobsType;
  setJobdetail: React.Dispatch<SetStateAction<number | null>>;
  setPage: React.Dispatch<SetStateAction<string | null>>;
  setFd: React.Dispatch<SetStateAction<_Fd>>;
  setEdit: React.Dispatch<SetStateAction<number | null>>;
  setApprovals:React.Dispatch<SetStateAction<Record<string,string|number>[]>>
  approvals:Record<string,string|number>[]
}  

export interface _jobs {
  id: number;
  title: string;
  location: string;
  jobType: string;
  flag: string;
  created_at: string;
  category: string;
  salary_range: string;
  detail: string;
}
export interface createJobsParamsType {
  setjobs: React.Dispatch<SetStateAction<_jobs[]>>;
  setPage: React.Dispatch<SetStateAction<string | null>>;
  setFd: React.Dispatch<SetStateAction<_Fd>>;
  setEdit: React.Dispatch<SetStateAction<number | null>>;
  fd: _Fd;
  edit: number | null;
  setMyjobs: React.Dispatch<SetStateAction<_myjobsType[]>>;
  setJobdetail: React.Dispatch<SetStateAction<number | null>>;
}
export interface proposalType {
  id: number;
  name: string;
  approval: string;
  career_id: string;
  career_owner: string;
  created_at: string;
  seenstatus: string;
  sender: string;
  flag: string;
  title: string;
}

export interface jobType {
  [key: string]: unknown;
  id: number;
  catagory: string;
  created_at: string;
  detail: string;
  flag: string;
  jobtype: string;
  location: string;
  posted_by: string;
  salary_range: string;
  title: string;
  updated_at: string;
}

export interface job_detailsPanel {
  proposal_ids: number[];
  job: jobType;
  setJobdetail: React.Dispatch<SetStateAction<number | null>>;
  proposals: proposalType[];
  setProposal_ids: React.Dispatch<SetStateAction<number[]>>;
  saved_ids: number[];
  setSaved_ids: React.Dispatch<SetStateAction<number[]>>;
  setSavedJobs: React.Dispatch<SetStateAction<jobType[]>>;
}

export interface countriesType {
  id: number;
  name: string;
  flag: string;
}
