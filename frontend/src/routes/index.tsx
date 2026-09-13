import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShieldCheck, Sparkles } from "lucide-react";

import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { MOCK_JOBS } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JobPortal — Find your next role" },
      {
        name: "description",
        content:
          "Browse curated engineering, design and data roles, or post openings as an employer on JobPortal.",
      },
      { property: "og:title", content: "JobPortal — Find your next role" },
      {
        property: "og:description",
        content: "Curated roles for candidates and simple hiring tools for employers.",
      },
    ],
  }),
  component: Home,
});

const HIGHLIGHTS = [
  {
    icon: Search,
    title: "Curated listings",
    body: "Every role is reviewed, so you spend time applying instead of filtering noise.",
  },
  {
    icon: ShieldCheck,
    title: "Two clear roles",
    body: "Candidates track applications, employers manage postings — same app, right tools.",
  },
  {
    icon: Sparkles,
    title: "Fast applications",
    body: "One profile, one click. No repeating the same form on every company site.",
  },
];

function Home() {
  const { user } = useAuth();
  const featured = MOCK_JOBS.slice(0, 3);

  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {MOCK_JOBS.length} open roles this week
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold sm:text-5xl">
            The job board that respects your time
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            JobPortal pairs candidates with roles worth reading and gives employers a calm place to
            run hiring.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/jobs">Browse jobs</Link>
            </Button>
            {!user && (
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Create an account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-4" />
              </span>
              <h2 className="mt-4 text-base font-semibold">{title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Featured roles</h2>
          <Link to="/jobs" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}
