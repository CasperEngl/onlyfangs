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

export default async function Invite() {
  const session = await auth();

  if (!session?.admin) {
    return redirect("/login");
  }

  const inviteCode = alphanumeric(20).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">
            Invite Participant to OnlyFangs
          </CardTitle>
          <CardDescription className="text-center text-foreground">
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
