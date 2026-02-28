import { NextResponse } from "next/server";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || "https://yookatale-server.onrender.com";

/** PUT /api/users/[id]/avatar - Proxy avatar upload to backend */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    const formData = await request.formData();
    const backendUrl = `${API_ORIGIN}/api/users/${id}/avatar`;

    const response = await fetch(backendUrl, {
      method: "PUT",
      body: formData,
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || data?.error || "Avatar update failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[avatar] Proxy error:", error);
    return NextResponse.json(
      { message: error?.message || "Avatar update failed" },
      { status: 500 }
    );
  }
}
