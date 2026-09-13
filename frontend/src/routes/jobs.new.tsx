import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { EMPTY_JOB_FORM, JobForm } from "@/components/job-form";

export const Route = createFileRoute("/jobs/new")({
  head: () => ({
    meta: [
      { title: "Post a job — JobPortal" },
      {
        name: "description",
        content:
          "Create a new job posting on JobPortal with role details, location, type and salary range.",
      },
      { property: "og:title", content: "Post a job — JobPortal" },
      {
        property: "og:description",
        content: "Publish a new opening and start receiving applications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewJobPage,
});

function NewJobPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All jobs
      </Link>

      <div className="mb-8 mt-6">
        <h1 className="text-2xl font-semibold">Post a job</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Describe the role. You can edit or pause the posting any time.
        </p>
      </div>

      <JobForm mode="create" initialValues={EMPTY_JOB_FORM} />
    </div>
  );
}
