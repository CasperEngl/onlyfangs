import { DrizzleAdapter } from "@auth/drizzle-adapter";
import invariant from "invariant";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { getPlayerByInviteCode } from "~/db";
import { pool } from "~/db/client";
import { db } from "~/db/schema";

invariant(process.env.AUTH_DISCORD_ID, "Missing AUTH_DISCORD_ID");
invariant(process.env.AUTH_DISCORD_SECRET, "Missing AUTH_DISCORD_SECRET");

declare module "next-auth" {
  interface Session {
    admin: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.admin =
          !!session.user.name && ["casper"].includes(session.user.name);
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Invite Code",
      credentials: {
        inviteCode: { label: "Invite Code", type: "text" },
      },
      async authorize(credentials) {
        const inviteCode = z.string().parse(credentials.inviteCode);

        const user = await getPlayerByInviteCode(pool, {
          code: inviteCode,
        });

        if (!user) {
          return null;
        }

        return {
          ...user,
        };
      },
    }),
  ],
});
