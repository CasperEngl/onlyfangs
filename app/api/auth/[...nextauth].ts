import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { consumeInviteCode } from "~/app/db";
import { pool } from "~/app/db/client";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Invite Code",
      credentials: {
        inviteCode: { label: "Invite Code", type: "text" },
      },
      async authorize(credentials) {
        const inviteCode = credentials?.inviteCode;

        if (inviteCode) {
          const user = await consumeInviteCode(pool, {
            code: inviteCode,
          });

          if (user) {
            // Invite code is valid, return the user object
            return user;
          }
        }

        // Invite code is invalid
        return null;
      },
    }),
  ],
});
