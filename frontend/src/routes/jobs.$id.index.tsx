import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { getJobById } from "@/lib/mock-data";

export const Route = createFileRoute("/jobs/$id/")({
  head: () => ({
    meta: [
      { title: "Job details — JobPortal" },
      {
        name: "description",
        content: "Role description, requirements, salary and application details on JobPortal.",
      },
      { property: "og:title", content: "Job details — JobPortal" },
      {
        property: "og:description",
        content: "See the full role description and apply in one click.",
      },
    ],
  }),
  component: JobDetail,
});

function JobDetail() {
  const { id } = Route.useParams();
  const job = getJobById(id);

  // Mock auth flag. Flip this to true to preview the "Apply now" state.
  const isLoggedIn = false;

  if (!job) return null;

  return (
    <>
      <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
        {isLoggedIn ? (
          <Button asChild size="lg">
            <Link to="/jobs/$id/apply" params={{ id }}>
              Apply now
            </Link>
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/login">Log in to apply</Link>
            </Button>
            <span className="text-sm text-muted-foreground">Takes under a minute.</span>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-base font-semibold">About the role</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{job.description}</p>

        <h2 className="mt-6 text-base font-semibold">What we look for</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {job.requirements.map((req) => (
            <li key={req} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {req}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
