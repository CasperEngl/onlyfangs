"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function LoginForm() {
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (code: string) => {
      const result = await signIn("credentials", {
        inviteCode: code,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Login successful!");
      router.push("/");
    },
    onError: (error) => {
      if (error.message === "CredentialsSignin") {
        toast.error("Invalid invite code", {
          description: "Please check your invite code and try again.",
        });
      } else {
        toast.error("An unknown error occurred", {
          description: "Please try again later or contact support.",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(inviteCode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="inviteCode" className="text-foreground">
          Invite Code
        </Label>
        <Input
          type="text"
          id="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
          className="border-border bg-card text-foreground"
          disabled={loginMutation.isPending}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-secondary text-secondary-foreground hover:bg-primary"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
