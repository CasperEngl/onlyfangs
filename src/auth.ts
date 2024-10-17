import { DrizzleAdapter } from "@auth/drizzle-adapter";
import invariant from "invariant";
import NextAuth from "next-auth";
import { authConfig } from "~/auth-config";
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
  adapter: DrizzleAdapter(db, {
    usersTable: Users as any,
    accountsTable: Accounts as any,
    authenticatorsTable: Authenticators as any,
    sessionsTable: Sessions as any,
    verificationTokensTable: VerificationTokens,
  }),
  ...authConfig,
});
