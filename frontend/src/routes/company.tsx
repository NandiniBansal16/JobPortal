import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CheckCircle2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

type CompanyProfile = {
  name: string;
  description: string;
  website: string;
  location: string;
};

const DEFAULT_COMPANY: CompanyProfile = {
  name: "Northwind Labs",
  description:
    "A fast-growing product studio building analytics tools for modern teams. We care about craft, autonomy, and work-life balance.",
  website: "https://northwind.example.com",
  location: "Bengaluru, IN",
};

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title: "Company profile — JobPortal" },
      {
        name: "description",
        content: "Manage your employer company profile on JobPortal.",
      },
      { property: "og:title", content: "Company profile — JobPortal" },
      { property: "og:description", content: "Edit your company details and hiring presence." },
    ],
  }),
  component: CompanyPage,
});

function CompanyPage() {
  const { user, isEmployer } = useAuth();
  const [form, setForm] = useState<CompanyProfile>(DEFAULT_COMPANY);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mock GET /api/companies/ — replace with a real fetch when the backend is ready.
  useEffect(() => {
    let mounted = true;
    async function load() {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (mounted) setForm(DEFAULT_COMPANY);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <Building2 className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-semibold">Sign in to continue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Employer profiles are only available to signed-in company accounts.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isEmployer) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Employer access only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page is for company accounts. Candidates can manage their profile instead.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/profile">Go to candidate profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  function handleChange(field: keyof CompanyProfile, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Mock POST /api/companies/ — wire this up to the real endpoint when ready.
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("POST /api/companies/", form);

    setIsLoading(false);
    setIsSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Company profile</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This information appears on your job postings and company page.
        </p>
      </div>

      {isSaved && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="size-4" />
          Company profile saved.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Company name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Acme Inc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            placeholder="What does your company do?"
            rows={6}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={form.website}
            onChange={(event) => handleChange("website", event.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={form.location}
            onChange={(event) => handleChange("location", event.target.value)}
            placeholder="Bengaluru, IN"
            required
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save company profile"}
          </Button>
          {isSaved && <span className="text-sm text-muted-foreground">Saved</span>}
        </div>
      </form>
    </div>
  );
}
