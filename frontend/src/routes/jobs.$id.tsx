import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, Building2, Clock, MapPin, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatSalary, getJobById } from "@/lib/mock-data";

export const Route = createFileRoute("/jobs/$id")({
  component: JobLayout,
});

function JobLayout() {
  const { id } = Route.useParams();
  const job = getJobById(id);

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Role not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This posting may have been closed.</p>
        <Link
          to="/jobs"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to jobs
        </Link>
      </div>
    );
  }

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All jobs
      </Link>

      <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{job.title}</h1>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="size-4" /> {job.company_name}
            </p>
          </div>
          <Badge variant="secondary">{job.job_type}</Badge>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" /> {job.location}
          </span>
          {salary && (
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="size-4" /> {salary}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" /> Posted {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
