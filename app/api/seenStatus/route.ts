import { NextRequest,NextResponse } from "next/server";
import { pool as db } from "@/lib/db";
export async function  POST(req:NextRequest) {
    try{
    const {jobId} =await req.json()
    if(!jobId){
            return NextResponse.json({ msg: "Job id is required"}, { status: 500 });
    }
    
    const result = await db.query("update proposals set seenstatus = true where id=$1",[jobId])
    console.log(jobId,result)
    return NextResponse.json({msg:"successful"}, { status: 200 });
    }catch(err){
    console.log(err);
    return NextResponse.json({ msg: `approval faild ${err}` }, { status: 500 });
    }
}