// app/context/SharedStateContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  use,
} from "react";
import amharic, { english, french, arabic,categoriesAm,categoriesAr,categoriesEn,categoriesFr,jobTypesAm,jobTypesAr,jobTypesEn,jobTypesFr,teamsAm,teamsAr,teamsEn,teamsFr,countriesAm,countriesEn,countriesFr,countriesAr } from "./_components/contents";
import ContentType, { countriesType } from "./interfaces";
// Define all states you want to share
type job_types = {
    id: number;
    name: string;
  };
  type JobCategory = {
    id: number;
    name: string;
  };
  type teamsType = {
    name:string;
    img:string;

    description:string;
    stars:number;
    halfStar:boolean;
    color:string;
    title:string
  }
type SharedStateType = {
  lang: string;
  setLang: (val: string) => void;
  content: ContentType;
  setContent: (val: ContentType) => void;
  jobTypes:job_types[];
  jobCategories:JobCategory[];
  teams:teamsType[];
  countries:countriesType[];
  setCountries:(val:countriesType[]) => void;
};

const SharedStateContext = createContext<SharedStateType | undefined>(
  undefined,
);

export const SharedStateProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState("En");
  const [content, setContent] = useState<ContentType>(english);
  const [jobTypes,setJobTypes] = useState<job_types[]>(jobTypesEn)
  const [jobCategories,setCatagories] = useState<JobCategory[]>(categoriesEn)
  const [teams,setTeam] = useState<teamsType[]>(teamsEn)
  const [countries,setCountries] = useState<countriesType[]>(countriesEn)
  useEffect(() => {
    if (lang == "Am") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent(amharic);
      setCountries(countriesAm)
      setJobTypes(jobTypesAm)
      setCatagories(categoriesAm)
      setTeam(teamsAm)
    } else if (lang == "Fr") {
      setContent(french);
      setCountries(countriesFr)
      setJobTypes(jobTypesFr)
      setCatagories(categoriesFr)
      setTeam(teamsFr)
    } else if (lang == "Ar") {
      setContent(arabic);
      setCountries(countriesAr)
      setJobTypes(jobTypesAr)
      setCatagories(categoriesAr)
      setTeam(teamsAr)
    } else if (lang == "En") {
      setContent(english);
      setCountries(countriesEn)
      setJobTypes(jobTypesEn)
      setCatagories(categoriesEn)
      setTeam(teamsEn)
    }
  }, [lang]);
  return (
    <SharedStateContext.Provider value={{ lang, setLang, content, setContent,teams,jobCategories,jobTypes,countries,setCountries }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context)
    throw new Error("useSharedState must be used within SharedStateProvider");
  return context;
};
