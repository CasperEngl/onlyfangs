import { customAlphabet } from "nanoid";
import { redirect } from "next/navigation";
import { InviteForm } from "~/app/invite/invite-form";
import { auth } from "~/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const alphanumeric = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

export default function Invite() {
  const session = auth();

  if (!session) {
    return redirect("/api/auth/signin");
  }

  const inviteCode = alphanumeric(20).toUpperCase();

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
          <InviteForm inviteCode={inviteCode} />
        </CardContent>
      </Card>
    </div>
  );
}
