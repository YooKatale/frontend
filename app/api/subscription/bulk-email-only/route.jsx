/**
 * Bulk subscription email-only API
 * Sends subscription emails to given addresses (no newsletter subscribe).
 * Use for fast bulk send from CSV (e.g. emailnew.csv).
 *
 * POST /api/subscription/bulk-email-only
 * Body: { emails: string[] }
 */

import { NextResponse } from "next/server";

function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
}

export const POST = async (req) => {
  try {
    const body = await req.json();
    const emails = body?.emails;

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "Invalid request", details: "Provide emails array" },
        { status: 400 }
      );
    }

    const valid = emails
      .map((e) => e?.toString().trim().toLowerCase())
      .filter((e) => isValidEmail(e));
    const unique = [...new Set(valid)];

    if (unique.length === 0) {
      return NextResponse.json(
        { error: "No valid emails", details: "At least one valid email required" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const base = req.nextUrl?.origin || `http://${host}`;
    const CONCURRENCY = 5;
    const CHUNK_DELAY_MS = 120;

    const sendOne = async (email) => {
      try {
        const res = await fetch(`${base}/api/mail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type: "subscription" }),
        });
        const data = await res.json().catch(() => ({}));
        return { email, sent: res.ok && !!data.success, status: res.ok && data.success ? "success" : "error" };
      } catch (e) {
        console.error(`⚠️ Mail failed ${email}:`, e.message);
        return { email, sent: false, status: "error" };
      }
    };

    const results = [];
    for (let i = 0; i < unique.length; i += CONCURRENCY) {
      const chunk = unique.slice(i, i + CONCURRENCY);
      const chunkResults = await Promise.all(chunk.map((email) => sendOne(email)));
      results.push(...chunkResults);
      if (i + CONCURRENCY < unique.length) {
        await new Promise((r) => setTimeout(r, CHUNK_DELAY_MS));
      }
    }

    const successCount = results.filter((r) => r.sent).length;
    const errorCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      total: unique.length,
      successCount,
      errorCount,
      results,
    });
  } catch (e) {
    console.error("❌ bulk-email-only:", e.message);
    return NextResponse.json(
      { error: "Failed to process", details: e.message },
      { status: 500 }
    );
  }
};
