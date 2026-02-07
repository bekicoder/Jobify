import { NextResponse, nextRequest } from "next/server";
import { pool as db } from "@/lib/db";
import jwt from "jsonwebtoken";
export async function GET(req: nextRequest) {
  try {
    const token = req.cookies.get("jobify-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET!);

    const { rows } = await db.query(
      "select * from savedJobs where user_id = $1 order by id desc",
      [decoded.id],
    );
    const savedJobs = await Promise.all(
      rows.map((sj) =>
        db
          .query("select * from jobs where id = $1;", [sj.career_id])
          .then((res) => res.rows[0]),
      ),
    );

    return NextResponse.json({ savedJobs: rows, data: savedJobs }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: `faild to save ${err}` }, { status: 500 });
  }
}

export async function POST(req: nextRequest) {
  try {
    const { jobId: id, saved } = await req.json();
    console.log(id);
    const token = req.cookies.get("jobify-token")?.value;
    if (!id) {
      return NextResponse.json({ msg: `id is required` }, { status: 401 });
    }
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET!);
    const sql = !saved
      ? "insert into savedJobs (career_id,user_id) values($1,$2) RETURNING career_id;"
      : "delete from savedJobs where career_id=$1;";
      console.log(!saved,"delete from savedJobs where career_id=$1",id)
    const values = [decoded.id];
    !saved && values.unshift(id);
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
