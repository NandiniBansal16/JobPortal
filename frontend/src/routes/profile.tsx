import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { fetchApi } from "@/lib/api";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Candidate profile - JobPortal" },
      {
        name: "description",
        content: "Edit your candidate profile, skills, links and resume on JobPortal.",
      },
      { property: "og:title", content: "Candidate profile - JobPortal" },
      { property: "og:description", content: "Update your profile and resume in one place." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isCandidate } = useAuth();
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMsg(null);

    // Helper to set error and scroll to top
    const showError = (msg: string) => {
      setErrorMsg(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Manual validation so we can show errors in our red box instead of native browser popups
    if (!skills.trim()) {
      showError("Skills are required. Please enter at least one skill.");
      return;
    }
    if (!resume) {
      showError("Please select a file for your resume.");
      return;
    }

    // Prepare the form data for file upload
    const formData = new FormData();
    formData.append("skills", skills);
    formData.append("resume_file", resume);
    
    // Note: Django currently only accepts 'skills' and 'resume_file'.
    // bio, portfolio_url, and github_url are ignored by the backend for now.

    try {
      // 1. Try to update an existing resume (PUT)
      let response = await fetchApi("/api/users/resume/", {
        method: "PUT",
        body: formData,
      });

      if (response.status === 404) {
        // 2. If it doesn't exist, create a new one (POST)
        response = await fetchApi("/api/users/resume/", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        alert("Profile saved successfully");
        router.navigate({ to: "/dashboard" });
      } else {
        const errorData = await response.json();
        console.error(errorData);
        // Extract the first error message if it's an object from Django
        const firstError = Object.values(errorData)[0];
        if (Array.isArray(firstError)) {
          showError(firstError[0]);
        } else {
          showError("Failed to save profile. Please make sure you filled out the required fields correctly.");
        }
      }
    } catch (error) {
      console.error("Profile save failed:", error);
      showError("Could not connect to the server. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Your candidate profile</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Help employers find you. Your resume and links are shown on your applications.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

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
          <Label htmlFor="skills">
            Skills<span className="text-destructive">*</span>
          </Label>
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
          <Label htmlFor="resume">
            Resume (PDF)<span className="text-destructive">*</span>
          </Label>
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
