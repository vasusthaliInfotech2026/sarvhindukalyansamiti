import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Contact ID is required." }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sarv_hindu_kalyan_samiti",
    });

    await connection.execute(`DELETE FROM contact_messages WHERE id = ?`, [id]);
    await connection.end();

    return NextResponse.json({ success: true, message: "Contact deleted successfully." });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

