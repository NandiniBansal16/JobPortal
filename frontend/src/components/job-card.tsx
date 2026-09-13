import { Link } from "@tanstack/react-router";
import { MapPin, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatSalary, type Job } from "@/lib/mock-data";

export function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <Link
      to="/jobs/$id"
      params={{ id: job.id }}
      className="group block rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold group-hover:text-primary">{job.title}</h3>
          <p className="text-sm text-muted-foreground">
            {job.company_name} · {job.location}
          </p>
        </div>
        <Badge variant="secondary">{job.job_type}</Badge>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" /> {job.location}
        </span>
        {salary && (
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="size-3.5" /> {salary}
          </span>
        )}
      </div>
    </Link>
  );
}
