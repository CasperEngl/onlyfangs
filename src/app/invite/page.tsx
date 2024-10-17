import { Button } from "~/components/ui/button";
import Form from "next/form";

export default function Invite() {
  return (
    <Form
      action={() => {
        "use server";
      }}
    >
      <input type="text" name="name" />
      <input type="text" name="invite_code" />

      <Button>Invite</Button>
    </Form>
  );
}
