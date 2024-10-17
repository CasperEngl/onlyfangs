import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getInviteCode, getPlayerByInviteCode } from "~/app/db";
import { pool } from "~/app/db/client";

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("invite_code");

  if (!param) {
    return new Response("Missing invite_code", { status: 400 });
  }

  const inviteCode = await getInviteCode(pool, {
    code: param,
  });

  if (!inviteCode) {
    return new Response("Missing invite_code", { status: 400 });
  }

  const player = await getPlayerByInviteCode(pool, {
    code: inviteCode.code,
  });

  if (!player) {
    return new Response("Invalid invite code", { status: 400 });
  }

  cookies().set("invite_code", inviteCode.code, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return new Response(`Hello World! ${player.username}`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });

  return NextResponse.redirect(new URL("/", request.url));
}
