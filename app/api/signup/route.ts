import { NextResponse, NextRequest } from "next/server";
import { pool as db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  countriesAm,
  countriesAr,
  countriesEn,
  countriesFr,
} from "@/app/_components/Contents";

export async function POST(req: NextRequest) {
  try {
    const {
      fname,
      lname,
      orgname,
      email,
      password,
      type: role,
      location,
      flag,
    } = await req.json();
    if (
      (role == "employee" && (!fname || !lname)) ||
      (role == "employer" && !orgname) ||
      !email ||
      !password ||
      !role ||
      !location ||
      !flag
    ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    const tableName =
      role == "employee" ? "users" : role == "employer" && "organizations";
    const { rows: doseExist } = await db.query(
      `select 1 from ${tableName}  where email = $1`,
      [email],
    );
    if (doseExist.length > 0) {
      return NextResponse.json({ message: `already exist` }, { status: 400 });
    }

    const profileColors = [
      "#0388D2",
      "#00579B",
      "#0098A7",
      "#00897B",
      "#004D40",
      "#68A039",
      "#EF6C00",
      "#F6511E",
      "#C1175C",
      "#AA47BD",
      "#7B1FA2",
      "#512DA7",
      "#455A65",
      "#D32F2F",
      "#388E3C",
      "#303F9F",
      "#FBC02D",
      "#5D4037",
    ];
    const EnLocation = countriesEn.filter(
      (countrie) => countrie.id == location,
    );
    const AmLocation = countriesAm.filter(
      (countrie) => countrie.id == location,
    );
    const FrLocation = countriesFr.filter(
      (countrie) => countrie.id == location,
    );
    const ArLocation = countriesAr.filter(
      (countrie) => countrie.id == location,
    );
    const locationMap: Record<string, string> = {
      EnLocation: EnLocation[0].name,
      AmLocation: AmLocation[0].name,
      ArLocation: ArLocation[0].name,
      FrLocation: FrLocation[0].name,
    };
    const hashedPass = await bcrypt.hash(password, 10);
    const name =
      role == "employee" ? fname + " " + lname : role == "employer" && orgname;
    const column_name = role == "employer" ? "orgname" : "name";
    const randomColor =
      profileColors[Math.floor(Math.random() * profileColors.length)];

    const sql = `INSERT INTO ${tableName} (${column_name},email, password,profile,flag,enlocation,amlocation,arlocation,frlocation) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
    const result = await db.query(sql, [
      name,
      email,
      hashedPass,
      randomColor,
      flag,
      locationMap.EnLocation,
      locationMap.AmLocation,
      locationMap.ArLocation,
      locationMap.FrLocation,
    ]);

    const user = result.rows[0];
    const token = jwt.sign(
      {
        id: user.id,
        name: user[column_name],
        email: user.email,
        role: user.role,
        profile: user.profile,
        flag: user.flag,
        enLocation: locationMap.EnLocation,
        amLocation: locationMap.AmLocation,
        arLocation: locationMap.ArLocation,
        frLocation: locationMap.FrLocation,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    console.log({
        id: user.id,
        name: user[column_name],
        email: user.email,
        role: role,
        profile: user.profile,
        flag: user.flag,
        enLocation: locationMap.EnLocation,
        amLocation: locationMap.AmLocation,
        arLocation: locationMap.ArLocation,
        frLocation: locationMap.FrLocation,
      },"dose this contain the role")
    const response = NextResponse.json(
      { message: "successful" },
      { status: 200 },
    );

    response.cookies.set({
      name: "jobify-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error ", data: err },
      { status: 500 },
    );
  }
}
