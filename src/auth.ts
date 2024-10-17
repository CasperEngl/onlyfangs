import { DrizzleAdapter } from "@auth/drizzle-adapter";
import invariant from "invariant";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { getPlayerByInviteCode } from "~/db";
import { pool } from "~/db/client";
import {
  Accounts,
  Authenticators,
  db,
  Sessions,
  Users,
  VerificationTokens,
} from "~/db/schema";

invariant(process.env.AUTH_DISCORD_ID, "Missing AUTH_DISCORD_ID");
invariant(process.env.AUTH_DISCORD_SECRET, "Missing AUTH_DISCORD_SECRET");

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  adapter: DrizzleAdapter(db, {
    usersTable: Users as never,
    accountsTable: Accounts as never,
    authenticatorsTable: Authenticators as never,
    sessionsTable: Sessions as never,
    verificationTokensTable: VerificationTokens,
  }),
  session: {
    strategy: "jwt",
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
          id: user?.id.toString(),
        };
      },
    }),
  ],
});
