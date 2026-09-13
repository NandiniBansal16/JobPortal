import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Candidate profile — JobPortal" },
      {
        name: "description",
        content: "Edit your candidate profile, skills, links and resume on JobPortal.",
      },
      { property: "og:title", content: "Candidate profile — JobPortal" },
      { property: "og:description", content: "Update your profile and resume in one place." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isCandidate } = useAuth();

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Sign in to continue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create or edit your candidate profile after logging in.
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

  if (!isCandidate) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Candidates only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page is for candidate profiles. Employers manage company details from the dashboard.
        </p>
        <Button asChild className="mt-6">
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    );
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setResume(file);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = {
      bio,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      portfolio_url: portfolioUrl,
      github_url: githubUrl,
      resume: resume?.name ?? null,
    };

    // Wire this up to POST /api/profiles/ (multipart/form-data for resume).
    console.log("Profile payload:", formData);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Your candidate profile</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Help employers find you. Your resume and links are shown on your applications.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Tell employers a little about yourself..."
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Input
            id="skills"
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="Python, React, Django"
          />
          <p className="text-xs text-muted-foreground">Separate skills with commas.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio URL</Label>
          <Input
            id="portfolio"
            type="url"
            value={portfolioUrl}
            onChange={(event) => setPortfolioUrl(event.target.value)}
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            type="url"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
            placeholder="https://github.com/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume">Resume</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground">PDF only.</p>
          {resume && <p className="text-xs text-muted-foreground">Selected: {resume.name}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Save profile
        </Button>
      </form>
    </div>
  );
}
