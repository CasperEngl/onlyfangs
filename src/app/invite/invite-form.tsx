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
          value={props.inviteCode}
          className="tabular-nums font-mono tracking-widest"
        />
      </div>

      <Button type="submit" className="w-full">
        Generate Invite
      </Button>
    </Form>
  );
}
