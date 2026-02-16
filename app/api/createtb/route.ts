import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db"; // your pool import
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    // Wrap all queries in a transaction
    await pool.query("BEGIN");
    
    // Create jobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_color VARCHAR(20)
);

    `);

    // Create jobtranslations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT comments_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);

    `);

    // Create organizations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_color VARCHAR(20)
);

    `);
    const hashePass = await bcrypt.hash("pass", 10);

// Create table
await pool.query(`
  CREATE TABLE IF NOT EXISTS managers (
      id SERIAL PRIMARY KEY,
      password VARCHAR(255) NOT NULL DEFAULT '${hashePass.trim()}',
      recovery_email VARCHAR(100) DEFAULT 'beki@gmail.com'
  );
`);
    // Create savedjobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    time_taken INTEGER NOT NULL,
    image_url VARCHAR(255)
);

    `);

    // Create users table
  
          await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT comments_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);

    `);
      await pool.query(`
     CREATE TABLE IF NOT EXISTS liked_foods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    liked_foodid INTEGER,
    CONSTRAINT liked_foods_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES customers(id)
        ON DELETE CASCADE,
    CONSTRAINT liked_foods_liked_foodid_fkey
        FOREIGN KEY (liked_foodid)
        REFERENCES foods(id)
        ON DELETE CASCADE
);

    `);
      await pool.query(`
     CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    food_id INTEGER,
    hour INTEGER,
    minute INTEGER,
    period VARCHAR(2),
    amount INTEGER,
    total_price NUMERIC(10,2),
    status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT orders_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES customers(id)
        ON DELETE CASCADE,
    CONSTRAINT orders_food_id_fkey
        FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE CASCADE
);


    `);

      await pool.query(`
     CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(32) PRIMARY KEY,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT sessions_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
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
