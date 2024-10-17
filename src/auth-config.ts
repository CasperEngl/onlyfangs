import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { getPlayerByInviteCode } from "~/db";
import { pool } from "~/db/client";

export const authConfig = {
  debug: process.env.NODE_ENV === "development",
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

        return user;
      },
    }),
  ],
};
