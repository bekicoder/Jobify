import { NextResponse,NextRequest } from "next/server";
import jwt,{JwtPayload}  from "jsonwebtoken";
 
export async function GET(req:NextRequest) {
  try{
    const token = req.cookies.get("jobify-token")?.value;
  if(!token){
    return NextResponse.json({message:"Unauthorized"},{status:401})
  }
    const userData = jwt.verify(token,process.env.JWT_SECRET!);
    const decoded = userData as JwtPayload;
      const {id,...data} = decoded;
      console.log(data)
    return NextResponse.json({...data});
  } catch(err){
    console.log(err)
    return NextResponse.json(
      { message: `Failed to fetch users ${err}` },
      { status: 500 }
    );
  }
}