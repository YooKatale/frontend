import { NextResponse } from "next/server";

const subscriptions = new set();

export async function POST(request) {
  try {
    const subscription = await request.json();

    // Save in DB in production
    subscriptions.add(JSON.stringify(subscription));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
