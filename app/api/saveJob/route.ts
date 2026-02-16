import { NextResponse, NextRequest } from "next/server";
import { pool as db } from "@/lib/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jobDataType } from "../myJobs/route";
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("jobify-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    const decoded = data as JwtPayload;
      const languages = ["en", "am", "ar", "fr"];
      const savedJobsRes:Record<string,number|string>[] = []
    const { rows } = await db.query(
      "select * from savedJobs where user_id = $1 order by id desc",
      [decoded.id],
    );
    const savedJobs = await Promise.all(
      rows.map(async (sj) => {
        const jobData:Record<string,number|string> = {}
        const { rows: job } = await db.query(
          "select * from jobs where id = $1;",
          [sj.career_id],
        );
        jobData["id"] = Number(sj.career_id)
        jobData["created_at"] = job[0].created_at;
        jobData["posted_by"] = job[0].posted_by;
        jobData["flag"] = job[0].flag;
        jobData["salary_range"] = job[0].salary_range
        await Promise.all(
          languages.map(async (lang) => {
            const lng = lang[0].toUpperCase() + lang[1];
            const titleKey = `title${lng}`;
            const detailKey = `detail${lng}`;
            const locationKey = `${lng}Location`;
            const jobtypeKey = `${lng}Jobtype`;
            const catagoryKey = `${lng}Catagory`;
            const { rows } = await db.query(
              `select * from jobTranslations where id = $1;`,
              [job[0][`${lang}jobid`]],
            );
            jobData[titleKey] = rows[0].title;
            jobData[detailKey] = rows[0].detail;
            jobData[locationKey] = rows[0].location;
            jobData[catagoryKey] = rows[0].catagory;
            jobData[jobtypeKey] = rows[0].jobtype;
          }),
        );
        savedJobsRes.push(jobData)
        console.log("this is before the savedres",savedJobsRes,sj.career_id,jobData,"this is the job data ")
      }),
    );
    return NextResponse.json({ data: savedJobsRes }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: `faild to save ${err}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { jobId: id, saved } = await req.json();
    console.log(saved)
    const token = req.cookies.get("jobify-token")?.value;
    if (!id) {
      return NextResponse.json({ msg: `id is required` }, { status: 401 });
    }
    if (!token) {
      return NextResponse.json({ msg: "unauthorized" }, { status: 401 });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    const decoded = data as JwtPayload;
    const sql = !saved
      ? "insert into savedJobs (career_id,user_id) values($1,$2) RETURNING career_id;"
      : "delete from savedJobs where career_id=$1;";
    const values = !saved ? [id, decoded.id] : [id];
    const { rows } = await db.query(sql, values);
    let savedJob;
    if (!saved) {
      const { rows: rows_ } = await db.query(
        "select * from jobs where id = $1;",
        [rows[0].career_id],
      );
      savedJob = rows_[0];
    }
    const res = !saved
      ? { msg: "successful", id: rows[0].career_id, savedJob: savedJob }
      : { msg: "successful" };
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: `faild to save ${err}` }, { status: 500 });
  }
}
