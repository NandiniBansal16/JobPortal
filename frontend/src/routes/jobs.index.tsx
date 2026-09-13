import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { JobCard } from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_JOBS, type Job } from "@/lib/mock-data";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Browse jobs — JobPortal" },
      {
        name: "description",
        content:
          "Search open engineering, design, data and writing roles with salary, location and remote details.",
      },
      { property: "og:title", content: "Browse jobs — JobPortal" },
      { property: "og:description", content: "Filter open roles by keyword, type and location." },
    ],
  }),
  component: JobsPage,
});

const JOB_TYPES: (Job["job_type"] | "All")[] = [
  "All",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

function JobsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Job["job_type"] | "All">("All");
  const [location, setLocation] = useState<string>("All");

  const locations = useMemo(
    () => ["All", ...Array.from(new Set(MOCK_JOBS.map((job) => job.location)))],
    [],
  );

  const jobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_JOBS.filter((job) => {
      const matchesQuery =
        !q ||
        `${job.title} ${job.description} ${job.company_name} ${job.requirements.join(" ")}`
          .toLowerCase()
          .includes(q);
      const matchesType = type === "All" || job.job_type === type;
      const matchesLocation = location === "All" || job.location === location;
      return matchesQuery && matchesType && matchesLocation;
    });
  }, [query, type, location]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-2xl font-semibold">Open roles</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {jobs.length} of {MOCK_JOBS.length} roles shown
      </p>

      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-card lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search" className="text-xs font-medium text-muted-foreground">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, company, or description…"
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:w-[28rem]">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-xs font-medium text-muted-foreground">
              Job type
            </Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as Job["job_type"] | "All")}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {JOB_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs font-medium text-muted-foreground">
              Location
            </Label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {locations.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No roles match those filters yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
