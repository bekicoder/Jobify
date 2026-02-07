import { NextResponse,NextRequest } from "next/server";
import { pool as db } from "@/lib/db";

export async function GET(){
  const { rows } =await db.query("select * from jobs order by id desc;")
  console.log(rows.length)
  return NextResponse.json({count:rows.length})
}


export async function POST(req:NextRequest){
    try{  
      const { id } = await req.json()
      const {rows} = await db.query("select * from jobs where id = $1 ",[id])
        return NextResponse.json(rows[0])
    }catch(err){
        return NextResponse.json(
            {error:`Failed to fetch jobs ${err}`},
            {status:500}
        )
    }
}