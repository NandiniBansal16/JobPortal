import { createFileRoute, Link } from "@tanstack/react-router";
import { X, MapPin, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { formatSalary, MOCK_SAVED_JOBS, type SavedJob } from "@/lib/mock-data";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved jobs — JobPortal" },
      {
        name: "description",
        content: "Jobs you have bookmarked on JobPortal.",
      },
      { property: "og:title", content: "Saved jobs — JobPortal" },
      { property: "og:description", content: "Jobs you have bookmarked on JobPortal." },
    ],
  }),
  component: SavedJobs,
});

function SavedJobs() {
  const { user, isCandidate } = useAuth();

  if (!user || !isCandidate) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Saved jobs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only signed-in candidates can view saved jobs.
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

  const saved = [...MOCK_SAVED_JOBS].sort(
    (a, b) => new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime(),
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Saved jobs</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {saved.length} {saved.length === 1 ? "job" : "jobs"} bookmarked
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/jobs">Browse more jobs</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((item) => (
          <SavedJobCard key={item.id} saved={item} />
        ))}
      </div>
    </div>
  );
}

function SavedJobCard({ saved }: { saved: SavedJob }) {
  const job = saved.job_details;
  const salary = formatSalary(job.salary_min, job.salary_max);

  function handleRemove(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log("Remove saved job:", { savedId: saved.id, jobId: job.id });
  }

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">
      <Link to="/jobs/$id" params={{ id: job.id }} className="block">
        <div className="flex items-start justify-between gap-4 pr-7">
          <div>
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

        <p className="mt-3 text-xs text-muted-foreground">
          Saved {formatSavedDate(saved.saved_at)}
        </p>
      </Link>

      <button
        type="button"
        onClick={handleRemove}
        aria-label={`Remove ${job.title} from saved jobs`}
        className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function formatSavedDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
