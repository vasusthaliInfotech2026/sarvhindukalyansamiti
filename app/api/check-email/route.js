import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: true, exists: false });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sarv_hindu_kalyan_samiti",
    });

    const [rows] = await connection.execute(
      `SELECT id FROM members WHERE email = ?`,
      [email]
    );

    await connection.end();

    if (rows.length > 0) {
      return NextResponse.json({ success: true, exists: true });
    }

    return NextResponse.json({ success: true, exists: false });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}