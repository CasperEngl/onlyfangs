import invariant from "invariant";
import { nanoid } from "nanoid";
import Form from "next/form";
import { createInviteCode, createPlayer } from "~/db";
import { pool } from "~/db/client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { redirect } from "next/navigation";
import { auth } from "~/auth";

export default async function Invite() {
  const session = await auth();

  console.log(session);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const inviteCode = nanoid(10);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Invite Participant to OnlyFangs
          </CardTitle>
          <CardDescription className="text-center">
            Use this form to generate an invite code and invite a new
            participant to OnlyFangs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            action={async (formData: FormData) => {
              "use server";

              const name = formData.get("name")?.toString();
              invariant(name, "Name is required");

              const createdInviteCode = await createInviteCode(pool, {
                code: inviteCode,
                createdBy: session.user.id,
              });
              invariant(createdInviteCode, "Failed to create invite code");

              const createdPlayer = await createPlayer(pool, {
                name,
                code: inviteCode,
                raceId: null,
                classId: null,
              });
              invariant(createdPlayer, "Failed to create player");

              // Redirect to a success page or the player's profile
              redirect(`/player/${createdPlayer.id}`);
            }}
          >
            <div className="mb-4">
              <Label htmlFor="name">Participant Name</Label>
              <Input type="text" name="name" id="name" required />
            </div>

            <div className="mb-6">
              <Label htmlFor="invite_code">Invite Code (Auto-generated)</Label>
              <Input
                type="text"
                name="invite_code"
                id="invite_code"
                readOnly
                value={inviteCode}
              />
            </div>

            <Button type="submit" className="w-full">
              Generate Invite
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
