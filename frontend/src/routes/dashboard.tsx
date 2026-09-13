import { createFileRoute, Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  MOCK_APPLICATIONS,
  MOCK_EMPLOYER_POSTINGS,
  statusBadgeClasses,
  statusDisplayName,
  getJobById,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — JobPortal" },
      {
        name: "description",
        content:
          "Candidates track applications and employers manage postings from the JobPortal dashboard.",
      },
      { property: "og:title", content: "Dashboard — JobPortal" },
      { property: "og:description", content: "Your applications or postings, in one place." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, isEmployer } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Sign in to continue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your dashboard changes depending on whether you're a candidate or an employer.
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

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {isEmployer ? "Hiring overview" : "Your applications"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isEmployer
              ? `Signed in as ${user.name} · ${user.company ?? "Your company"}`
              : `Signed in as ${user.name}`}
          </p>
        </div>
        {isEmployer ? (
          <Button>Post a job</Button>
        ) : (
          <Button asChild variant="outline">
            <Link to="/jobs">Find more roles</Link>
          </Button>
        )}
      </div>

      {isEmployer ? <EmployerPanel /> : <CandidatePanel />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

function CandidatePanel() {
  const applications = [...MOCK_APPLICATIONS].sort(
    (a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime(),
  );

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Applications" value={String(applications.length)} />
        <Stat
          label="In review"
          value={String(applications.filter((a) => a.status === "reviewing").length)}
        />
        <Stat
          label="Interviews"
          value={String(
            applications.filter((a) => a.status === "interviewed" || a.status === "hired").length,
          )}
        />
      </div>

      <div className="mt-8 grid gap-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-semibold">{application.job_title}</h3>
              <p className="text-sm text-muted-foreground">
                Applied {formatAppliedDate(application.applied_at)}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn("w-fit capitalize", statusBadgeClasses[application.status])}
            >
              {statusDisplayName[application.status]}
            </Badge>
          </div>
        ))}
      </div>
    </>
  );
}

function formatAppliedDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function EmployerPanel() {
  const totalApplicants = MOCK_EMPLOYER_POSTINGS.reduce((sum, p) => sum + p.applicants, 0);
  const totalViews = MOCK_EMPLOYER_POSTINGS.reduce((sum, p) => sum + p.views, 0);

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Active postings" value={String(MOCK_EMPLOYER_POSTINGS.length)} />
        <Stat label="Applicants" value={String(totalApplicants)} />
        <Stat label="Views" value={totalViews.toLocaleString()} />
      </div>

      <div className="mt-8 space-y-3">
        {MOCK_EMPLOYER_POSTINGS.map((posting) => {
          const job = getJobById(posting.jobId);
          if (!job) return null;
          return (
            <div
              key={posting.jobId}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div>
                <Link
                  to="/jobs/$id"
                  params={{ id: job.id }}
                  className="font-semibold hover:text-primary"
                >
                  {job.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {job.location} · {posting.views.toLocaleString()} views · {posting.applicants}{" "}
                  applicants
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={posting.status === "Active" ? "secondary" : "outline"}>
                  {posting.status}
                </Badge>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
