import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Role } from "@/lib/auth";
import { RoleToggle } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an account — JobPortal" },
      {
        name: "description",
        content:
          "Sign up on JobPortal as a candidate to apply for roles or as an employer to hire.",
      },
      { property: "og:title", content: "Create an account — JobPortal" },
      {
        property: "og:description",
        content: "Join JobPortal in under a minute as a candidate or employer.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [role, setRole] = useState<Role>("candidate");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {role === "employer"
          ? "Register as an employer to post jobs and manage applications."
          : "Register as a candidate to browse and apply for jobs."}
      </p>

      <form
        className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6 shadow-card"
        onSubmit={(event) => {
          event.preventDefault();

          // Placeholder for the real API call:
          // POST /api/users/register/   body: { username, email, password, role }
          console.log({ username, email, password, role });
        }}
      >
        <RoleToggle value={role} onChange={setRole} />

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ada_lovelace"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full">
          Create {role} account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
