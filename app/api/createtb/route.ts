import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db"; // your pool import

export async function GET(req: NextRequest) {
  try {
    // Wrap all queries in a transaction
    await pool.query("BEGIN");

    // Create jobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.jobs (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT now(),
        enjobid INTEGER NOT NULL,
        amjobid INTEGER NOT NULL,
        arjobid INTEGER NOT NULL,
        frjobid INTEGER NOT NULL,
        flag VARCHAR NOT NULL,
        posted_by VARCHAR NOT NULL,
        salary_range VARCHAR NOT NULL,
        updated_at VARCHAR
      );
    `);

    // Create jobtranslations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.jobtranslations (
        id SERIAL PRIMARY KEY,
        location VARCHAR NOT NULL,
        jobtype VARCHAR NOT NULL,
        catagory VARCHAR NOT NULL,
        detail TEXT NOT NULL,
        title TEXT NOT NULL
      );
    `);

    // Create organizations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.organizations (
        id SERIAL PRIMARY KEY,
        orgname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        profile VARCHAR,
        flag VARCHAR,
        created_at TIMESTAMP DEFAULT now(),
        password VARCHAR NOT NULL,
        enlocation VARCHAR,
        amlocation VARCHAR,
        arlocation VARCHAR,
        frlocation VARCHAR
      );
    `);

    // Create proposals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.proposals (
        id SERIAL PRIMARY KEY,
        sender VARCHAR NOT NULL,
        career_id TEXT,
        created_at VARCHAR DEFAULT now(),
        career_owner VARCHAR,
        name VARCHAR,
        sender_flag VARCHAR,
        seenstatus BOOLEAN DEFAULT false,
        approval VARCHAR DEFAULT 'pending',
        amproposal TEXT,
        arproposal TEXT,
        frproposal TEXT,
        enproposal TEXT,
        senderlocen VARCHAR,
        senderlocam VARCHAR,
        senderlocfr VARCHAR,
        senderlocar VARCHAR
      );
    `);

    // Create savedjobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.savedjobs (
        id SERIAL PRIMARY KEY,
        career_id TEXT NOT NULL,
        saved_at VARCHAR DEFAULT now(),
        user_id VARCHAR NOT NULL
      );
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT now(),
        password VARCHAR,
        profile VARCHAR,
        flag VARCHAR,
        enlocation VARCHAR,
        amlocation VARCHAR,
        arlocation VARCHAR,
        frlocation VARCHAR
      );
    `);

    await pool.query("COMMIT");

    return NextResponse.json({ message: "All tables created successfully!" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error creating tables:", error);
    return NextResponse.json({ error: "Failed to create tables", details: error }, { status: 500 });
  }
}
