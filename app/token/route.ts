import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  return new Response(`Hello World! ${token}`);
}
