import { NextResponse } from "next/server";
import pool from "@/lib/db1";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT 1 AS connected");

    return NextResponse.json({
      success: true,
      message: "MySQL connected successfully",
      result: rows,
    });
  } catch (error) {
    console.error("MySQL connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}