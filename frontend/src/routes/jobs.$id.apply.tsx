import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getJobById } from "@/lib/mock-data";

export const Route = createFileRoute("/jobs/$id/apply")({
  head: () => ({
    meta: [
      { title: "Apply — JobPortal" },
      {
        name: "description",
        content: "Apply to this role on JobPortal with your resume and an optional cover letter.",
      },
      { property: "og:title", content: "Apply — JobPortal" },
      { property: "og:description", content: "Submit your application in seconds." },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { id } = Route.useParams();
  const job = getJobById(id);

  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!job) return null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setResume(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!resume) return;

    setIsSubmitting(true);

    // Mock network delay. Wire this up to POST /api/applications/ as multipart/form-data.
    const formData = new FormData();
    formData.append("job", id);
    formData.append("resume", resume);
    if (coverLetter.trim()) {
      formData.append("cover_letter", coverLetter.trim());
    }

    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log("Application submitted", {
      job: id,
      resume: resume.name,
      cover_letter: coverLetter.trim() || null,
    });

    setIsSubmitting(false);
    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <div className="mt-6 rounded-xl border border-border bg-card p-8 py-16 text-center shadow-card">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold">Application submitted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Good luck! {job.company_name} will review your resume and cover letter.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/jobs">Browse more jobs</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        to="/jobs/$id"
        params={{ id }}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to role
      </Link>

      <form
        onSubmit={handleSubmit}
        className="mt-4 space-y-6 rounded-xl border border-border bg-card p-6 shadow-card"
      >
        <div>
          <h2 className="text-lg font-semibold">Submit your application</h2>
          <p className="text-sm text-muted-foreground">
            Apply to {job.title} at {job.company_name}.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume">
            Resume <span className="text-destructive">*</span>
          </Label>
          <Input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,application/pdf"
            required
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground">PDF only.</p>
          {resume && <p className="text-xs text-muted-foreground">Selected: {resume.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover_letter">Cover letter</Label>
          <Textarea
            id="cover_letter"
            name="cover_letter"
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
            placeholder="Why are you a great fit for this role? (optional)"
            rows={6}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!resume || isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Submit application"}
        </Button>
      </form>
    </>
  );
}
