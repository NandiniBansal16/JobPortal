import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { JobForm, type JobFormValues } from "@/components/job-form";
import { getJobById } from "@/lib/mock-data";

export const Route = createFileRoute("/jobs/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit job posting — JobPortal" },
      {
        name: "description",
        content: "Update the details, location, type and salary range of your JobPortal posting.",
      },
      { property: "og:title", content: "Edit job posting — JobPortal" },
      { property: "og:description", content: "Keep your opening accurate and up to date." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EditJobPage,
});

function EditJobPage() {
  const { id } = Route.useParams();
  const job = getJobById(id);

  if (!job) return null;

  const initialValues: JobFormValues = {
    title: job.title,
    description: job.description,
    requirements: job.requirements.join("\n"),
    location: job.location,
    job_type: job.job_type,
    salary_min: job.salary_min === null ? "" : String(job.salary_min),
    salary_max: job.salary_max === null ? "" : String(job.salary_max),
  };

  return (
    <>
      <Link
        to="/jobs/$id"
        params={{ id }}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to role
      </Link>

      <div className="mb-6 mt-4">
        <h2 className="text-lg font-semibold">Edit job posting</h2>
        <p className="text-sm text-muted-foreground">Changes go live as soon as you save.</p>
      </div>

      <JobForm mode="edit" jobId={id} initialValues={initialValues} />
    </>
  );
}
