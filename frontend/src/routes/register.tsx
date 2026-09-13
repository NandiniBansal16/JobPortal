import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Role } from "@/lib/auth";
import { fetchApi } from "@/lib/api";
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {role === "employer"
          ? "Register as an employer to post jobs and manage applications."
          : "Register as a candidate to browse and apply for jobs."}
      </p>

      {errorMsg && (
        <div className="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      <form
        className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6 shadow-card"
        onSubmit={async (event) => {
          event.preventDefault();
          setErrorMsg(null);

          try {
            // 1. Make a POST request to register the user
            const response = await fetchApi("/api/users/register/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, email, password, role }),
            });

            if (response.ok) {
              // 2. Automatically log the user in!
              const loginResponse = await fetchApi("/api/token/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
              });
              
              if (loginResponse.ok) {
                const tokenData = await loginResponse.json();
                const accessToken = tokenData.access;
                
                const profileResponse = await fetchApi("/api/users/me/", {
                  headers: { Authorization: `Bearer ${accessToken}` }
                });
                
                if (profileResponse.ok) {
                  const profile = await profileResponse.json();
                  login(accessToken, {
                    name: profile.username,
                    email: profile.email,
                    role: profile.role
                  });
                  // 3. Redirect directly to the dashboard!
                  router.navigate({ to: "/dashboard" });
                }
              } else {
                 setErrorMsg("Account created, but automatic login failed. Please try logging in manually.");
              }
            } else {
              const errorData = await response.json();
              console.error(errorData);
              // Check if Django provided specific field errors (e.g., {"username": ["This field must be unique."]})
              const firstError = Object.values(errorData)[0];
              if (Array.isArray(firstError)) {
                  setErrorMsg(firstError[0]);
              } else {
                  setErrorMsg("Failed to create account. Username or email might already be taken.");
              }
            }
          } catch (error) {
            console.error("Registration failed", error);
            setErrorMsg("Could not connect to the server.");
          }
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
