/**
 * GET /api/contact-info
 * Returns dynamic contact details for the Contact page.
 * Uses env vars when set; otherwise fallbacks to YooKatale defaults.
 */

import { NextResponse } from "next/server";

const FALLBACK = {
  phone: "+256786118137",
  email: "info@yookatale.app",
  whatsapp: "256786118137",
  address: "Kampala, Uganda",
  businessHours: "Mon–Sat 8am–8pm EAT",
};

export async function GET() {
  try {
    const data = {
      phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || FALLBACK.phone,
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || FALLBACK.email,
      whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || FALLBACK.whatsapp,
      address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || FALLBACK.address,
      businessHours: process.env.NEXT_PUBLIC_CONTACT_HOURS || FALLBACK.businessHours,
    };
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(FALLBACK, { status: 200 });
  }
}
