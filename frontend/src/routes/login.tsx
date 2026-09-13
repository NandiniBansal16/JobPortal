import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Role } from "@/lib/auth";
import { fetchApi } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — JobPortal" },
      {
        name: "description",
        content: "Log in to JobPortal as a candidate to track applications or as an employer.",
      },
      { property: "og:title", content: "Log in — JobPortal" },
      {
        property: "og:description",
        content: "Access your JobPortal candidate or employer account.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter your username and password to sign in.
      </p>

      {errorMsg && (
        <div className="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      <form
        className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6 shadow-card"
         onSubmit={async (event) => {
          event.preventDefault(); // Prevents the page from refreshing on submit
          setErrorMsg(null);
          
          try {
            // 1. Make a POST request to the backend with the username and password
            const response = await fetchApi("/api/token/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
              // 2. The backend responds with { access, refresh } tokens.
              const data = await response.json();
              const accessToken = data.access;
              
              // 3. Now that we have the token, we fetch the user's actual profile details from the database.
              // Notice we manually pass the token here because it isn't in localStorage yet!
              const profileResponse = await fetchApi("/api/users/me/", {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              
              if (profileResponse.ok) {
                const profile = await profileResponse.json();
                
                // 4. Save the token and the real profile data into our React Context!
                login(accessToken, {
                  name: profile.username,
                  email: profile.email,
                  role: profile.role
                });
                
                // 5. Send them back to the home page!
                router.navigate({ to: "/" });
              } else {
                setErrorMsg("Failed to load user profile.");
              }
            } else {
              setErrorMsg("Invalid username or password!");
            }
          } catch (error) {
            console.error("Login failed", error);
            setErrorMsg("Could not connect to the server.");
          }
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="you"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export function RoleToggle({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  const roles: { value: Role; label: string; hint: string }[] = [
    { value: "candidate", label: "Candidate", hint: "Find and track jobs" },
    { value: "employer", label: "Employer", hint: "Post and manage roles" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {roles.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={
              active
                ? "rounded-lg border border-primary bg-accent p-3 text-left"
                : "rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary/40"
            }
          >
            <span className="block text-sm font-medium">{option.label}</span>
            <span className="block text-xs text-muted-foreground">{option.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
