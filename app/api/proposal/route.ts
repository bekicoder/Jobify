import { NextRequest,NextResponse } from "next/server";
import { pool as db } from "@/lib/db";
import  jwt  from "jsonwebtoken";

export async function GET(req:NextRequest){
    try{
    const token = req.cookies.get("jobify-token")?.value;
    const {searchParams} = new URL(req.url)
    const role = searchParams.get("role")
    const id = searchParams.get("id")
    if(!token){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }
    if(id){
        const { rows } = await db.query("select * from proposals where id = $1;",[id])
        return NextResponse.json({data:rows[0]},{status:200})
    }
    const decoded = await jwt.verify(token,process.env.JWT_SECRET!)
    console.log(decoded)
    const sql = `select * from proposals where ${role == "employer" ? "career_owner" : "sender" } = $1 order by id desc;`
    const {rows} = await db.query(sql,[decoded.email])
    return NextResponse.json({data:rows},{status:200})
}catch(err){
    console.log(err)
    return NextResponse.json(
      { message: `Failed  ${err}` },
      { status: 500 }
    );
}
}

export async function POST(req:NextRequest){
    try{
    const token = req.cookies.get("jobify-token")?.value;
    const proposal = await req.json()
    if(!proposal){
        return NextResponse.json({error:"Invalid credentials"},
        {status:400})
    }
    if(!token){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }
    const decoded = await jwt.verify(token,process.env.JWT_SECRET!)
    const values = [decoded.name,decoded.email,decoded.location,proposal.id,proposal.article,proposal.owner,decoded.flag]
    console.log(values)
    const {rows} = await db.query("insert into proposals (name,sender,sender_location,career_id,proposal,career_owner,sender_flag) values($1,$2,$3,$4,$5,$6,$7) RETURNING id;",values)
    return NextResponse.json({msg:"successful",id:rows[0].id},{status:200})
}catch(err){
    console.log(err)
    return NextResponse.json(
      { message: `Failed  ${err}` },
      { status: 500 }
    );
}
}