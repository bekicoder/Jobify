import { NextRequest, NextResponse } from "next/server";
import { pool as db } from "@/lib/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { splitText, translateLargeText } from "../createJob/route";
import { franc } from "franc";
import { countriesEn,categoriesAm,categoriesAr,categoriesFr, countriesAm, countriesFr, countriesAr } from "@/app/_components/contents";
import { jobData } from "../myJobs/route";
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("jobify-token")?.value;
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const id = searchParams.get("id");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (id) {
      const { rows } = await db.query(
        "select * from proposals where id = $1;",
        [id],
      );
      return NextResponse.json({ data: rows[0] }, { status: 200 });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    const decoded = data as JwtPayload;
    const sql = `select * from proposals where ${role == "employer" ? "career_owner" : "sender"} = $1 order by id desc;`;
    const { rows } = await db.query(sql, [decoded.email]);
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: `Failed  ${err}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("jobify-token")?.value;
    const proposal = await req.json();
    const article = proposal.article;
    if (!proposal) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 },
      );
    }
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    const decoded = data as JwtPayload;
    const languages = ["En", "Am", "Fr", "Ar"];
    const isoMap: Record<string, string> = {
      eng: "En",
      amh: "Am",
      arb: "Ar",
      fra: "Fr",
    };
    const proposalData: Record<string, string> = {};
    const detectedLang = franc(article);
    console.log(detectedLang,"this is the lang")
    const lang = isoMap[detectedLang] || "En";
    const locationId = countriesEn.filter((c)=>c.name == proposal.location)
    const countriesMap:Record<string,{id:number,name:string}[]> = {
        En:countriesEn,
        Am:countriesAm,
        Fr:countriesFr,
        Ar:countriesAr
    }
    languages.map((lng)=>{
        const countrie = countriesMap[lng].filter(c=>{
            return c.id == Number(locationId[0].id)
        })
        proposalData[`senderloc${lng.toLowerCase()}`] = countrie[0].name
    })
    //     return NextResponse.json(
    //   { msg: "successful", id: proposalData },
    //   { status: 200 },
    // );
    const values = Object.values(proposalData)
    values.unshift(
      decoded.name,
      decoded.email,
       decoded.flag,
      proposal.id,
      proposal.posted_by)
    await Promise.all(
      languages.map(async (language) => {
        const proposalKey = `${language.toLowerCase()}proposal`;
        if (language === lang) {
          proposalData[proposalKey] = article;
          values.push(article);
          return;
        }
        const [proposalRes] = await Promise.all([
          translateLargeText(
            article,
            lang.toLowerCase(),
            language.toLowerCase(),
          ),
        ]);
        proposalData[proposalKey] = proposalRes.translated;
        values.push(proposalRes.translated);
      }),
    );
    const { rows } = await db.query(
      `insert into proposals (name,sender,sender_flag,career_id,career_owner,senderlocEn,senderlocam,senderlocfr,senderlocar,enproposal,arproposal,amproposal,frproposal) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id;`,
      values,
    );
    return NextResponse.json(
      { msg: "successful", id: rows[0].id },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: `Failed  ${err}` }, { status: 500 });
  }
}
