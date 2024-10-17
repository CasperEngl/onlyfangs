"use client";

import invariant from "invariant";
import Form from "next/form";
import { inviteParticipant } from "~/app/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function InviteForm(props: { inviteCode: string }) {
  return (
    <Form
      action={async (formData: FormData) => {
        const name = formData.get("name")?.toString();
        invariant(name, "Name is required");

        await inviteParticipant({
          name,
          inviteCode: props.inviteCode,
        });
      }}
    >
      <div className="mb-4">
        <Label htmlFor="name" className="text-foreground">
          Participant Name
        </Label>
        <Input
          type="text"
          name="name"
          id="name"
          required
          className="border-border bg-card text-foreground"
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="invite_code" className="text-foreground">
          Invite Code (Auto-generated)
        </Label>
        <Input
          type="text"
          name="invite_code"
          id="invite_code"
          readOnly
          value={props.inviteCode}
          className="border-border bg-card font-mono tabular-nums tracking-widest text-foreground"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-secondary text-secondary-foreground hover:bg-primary"
      >
        Generate Invite
      </Button>
    </Form>
  );
}
