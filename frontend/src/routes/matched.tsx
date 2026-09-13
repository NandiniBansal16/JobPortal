import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Wallet, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { formatSalary, MOCK_MATCHED_JOBS, type MatchedJob } from "@/lib/mock-data";

export const Route = createFileRoute("/matched")({
  head: () => ({
    meta: [
      { title: "Matched jobs — JobPortal" },
      {
        name: "description",
        content: "Jobs ranked by how well they match your skills on JobPortal.",
      },
      { property: "og:title", content: "Matched jobs — JobPortal" },
      {
        property: "og:description",
        content: "Jobs ranked by how well they match your skills.",
      },
    ],
  }),
  component: MatchedJobs,
});

function MatchedJobs() {
  const { user, isCandidate } = useAuth();

  if (!user || !isCandidate) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Matched jobs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only signed-in candidates can see jobs matched to their skills.
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

  const matched = [...MOCK_MATCHED_JOBS].sort((a, b) => b.match_score - a.match_score);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Matched for you</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Jobs ranked by how well they fit your profile
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/jobs">Browse all jobs</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matched.map((job) => (
          <MatchedJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

function MatchedJobCard({ job }: { job: MatchedJob }) {
  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <Link
      to="/jobs/$id"
      params={{ id: job.id }}
      className="group block rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold group-hover:text-primary">{job.title}</h3>
          <p className="text-sm text-muted-foreground">
            {job.company_name} · {job.location}
          </p>
        </div>
        <Badge variant="secondary">{job.job_type}</Badge>
      </div>

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

      <div className="mt-5">
        <div className="flex items-center justify-between gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5 text-primary">
            <Sparkles className="size-3.5" />
            {job.match_score}% match
          </span>
          <span className="text-muted-foreground">{job.match_score}/100</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${job.match_score}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
