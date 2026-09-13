export type Job = {
  id: string;
  company_name: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  job_type: "Full-time" | "Part-time" | "Contract" | "Internship";
  salary_min: number | null;
  salary_max: number | null;
  is_active: boolean;
  created_at: string;
};

export const MOCK_JOBS: Job[] = [
  {
    id: "1",
    company_name: "Northwind Labs",
    title: "Senior Frontend Engineer",
    description:
      "Own the design system and core product surfaces of our analytics platform. You will lead frontend architecture, ship polished accessible interfaces, and mentor junior engineers.",
    requirements: [
      "5+ years building production React applications",
      "Strong TypeScript and component design skills",
      "Comfort with performance profiling and accessibility",
    ],
    location: "Bengaluru, IN",
    job_type: "Full-time",
    salary_min: 3_200_000,
    salary_max: 4_800_000,
    is_active: true,
    created_at: "2026-08-25T10:00:00Z",
  },
  {
    id: "2",
    company_name: "Cobalt Studio",
    title: "Product Designer",
    description:
      "Shape end-to-end flows for a fintech onboarding experience. This is a six-month engagement where you will run usability sessions and hand off production-ready specs.",
    requirements: [
      "Portfolio with shipped consumer or fintech work",
      "Fluency in Figma and component libraries",
      "Experience running lightweight user research",
    ],
    location: "Remote",
    job_type: "Contract",
    salary_min: 1_200_000,
    salary_max: 1_500_000,
    is_active: true,
    created_at: "2026-08-24T10:00:00Z",
  },
  {
    id: "3",
    company_name: "Ledgerly",
    title: "Backend Engineer, Payments",
    description:
      "Build reliable ledgers and reconciliation pipelines at scale. Design idempotent transaction flows and reduce settlement latency across partners.",
    requirements: [
      "3+ years with Node.js or Go services",
      "Solid relational database modelling",
      "Bonus: prior payments or accounting systems work",
    ],
    location: "Pune, IN",
    job_type: "Full-time",
    salary_min: 2_800_000,
    salary_max: 4_000_000,
    is_active: true,
    created_at: "2026-08-20T10:00:00Z",
  },
  {
    id: "4",
    company_name: "Brightpath",
    title: "Data Analyst Intern",
    description:
      "Support the growth team with reporting and experiment analysis. A six-month internship with a path to full-time, focused on dashboards and clean data pipelines.",
    requirements: [
      "Working knowledge of SQL",
      "Some Python or R exposure",
      "Curiosity and clear written communication",
    ],
    location: "Hyderabad, IN",
    job_type: "Internship",
    salary_min: 480_000,
    salary_max: 600_000,
    is_active: true,
    created_at: "2026-08-31T10:00:00Z",
  },
  {
    id: "5",
    company_name: "Northwind Labs",
    title: "DevOps Engineer",
    description:
      "Keep deploys boring: automate infra and tighten observability. Own Terraform modules, cut deploy times, and build alerting that keeps a small team confident shipping daily.",
    requirements: [
      "Hands-on Kubernetes in production",
      "Infrastructure as code discipline",
      "Strong incident response instincts",
    ],
    location: "Remote",
    job_type: "Full-time",
    salary_min: 3_000_000,
    salary_max: 4_200_000,
    is_active: true,
    created_at: "2026-08-28T10:00:00Z",
  },
  {
    id: "6",
    company_name: "Cobalt Studio",
    title: "Technical Writer",
    description:
      "Turn dense API surfaces into docs people actually finish reading. Own developer documentation, quickstarts, API references, and migration guides.",
    requirements: [
      "Published developer documentation samples",
      "Comfort reading code to verify examples",
      "Editorial rigour and consistency",
    ],
    location: "Remote",
    job_type: "Part-time",
    salary_min: 720_000,
    salary_max: 900_000,
    is_active: true,
    created_at: "2026-08-23T10:00:00Z",
  },
  {
    id: "7",
    company_name: "Acme Corp",
    title: "Mobile Engineer",
    description:
      "Build and maintain cross-platform mobile apps for our logistics product. Work closely with backend and design to deliver a smooth field experience.",
    requirements: [
      "2+ years with React Native or Flutter",
      "Experience shipping apps to App Store / Play Store",
      "Comfort debugging native modules",
    ],
    location: "Bengaluru, IN",
    job_type: "Full-time",
    salary_min: 2_500_000,
    salary_max: 3_800_000,
    is_active: true,
    created_at: "2026-08-22T10:00:00Z",
  },
  {
    id: "8",
    company_name: "FinEdge",
    title: "QA Engineer",
    description:
      "Ensure quality across our payments web and mobile products. Own test strategy, automate regression suites, and drive release confidence.",
    requirements: [
      "2+ years in manual and automated testing",
      "Experience with Playwright, Cypress, or Selenium",
      "Strong attention to detail and clear bug reports",
    ],
    location: "Mumbai, IN",
    job_type: "Full-time",
    salary_min: 1_800_000,
    salary_max: 2_600_000,
    is_active: true,
    created_at: "2026-08-26T10:00:00Z",
  },
];

export function getJobById(id: string): Job | undefined {
  return MOCK_JOBS.find((job) => job.id === id);
}

export function formatSalary(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => `₹${(n / 100_000).toFixed(1)}L`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return min ? fmt(min) : fmt(max!);
}

export type ApplicationStatus = "applied" | "reviewing" | "interviewed" | "rejected" | "hired";

export type Application = {
  id: string;
  job_title: string;
  status: ApplicationStatus;
  applied_at: string;
};

export const statusBadgeClasses: Record<ApplicationStatus, string> = {
  applied:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  reviewing:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  interviewed:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900",
  rejected:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  hired:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
};

export const statusDisplayName: Record<ApplicationStatus, string> = {
  applied: "Applied",
  reviewing: "Reviewing",
  interviewed: "Interviewed",
  rejected: "Rejected",
  hired: "Hired",
};

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    job_title: "Senior Frontend Engineer",
    status: "hired",
    applied_at: "2026-09-03T10:00:00Z",
  },
  {
    id: "app-2",
    job_title: "QA Engineer",
    status: "interviewed",
    applied_at: "2026-09-02T10:00:00Z",
  },
  {
    id: "app-3",
    job_title: "Backend Engineer, Payments",
    status: "reviewing",
    applied_at: "2026-08-30T10:00:00Z",
  },
  {
    id: "app-4",
    job_title: "Data Analyst Intern",
    status: "applied",
    applied_at: "2026-08-28T10:00:00Z",
  },
  {
    id: "app-5",
    job_title: "Mobile Engineer",
    status: "rejected",
    applied_at: "2026-08-25T10:00:00Z",
  },
];

export const MOCK_EMPLOYER_POSTINGS = [
  { jobId: "1", views: 1240, applicants: 42, status: "Active" as const },
  { jobId: "5", views: 860, applicants: 27, status: "Active" as const },
  { jobId: "2", views: 410, applicants: 18, status: "Paused" as const },
];

export type SavedJob = {
  id: string;
  saved_at: string;
  job_details: {
    id: string;
    title: string;
    company_name: string;
    location: string;
    job_type: Job["job_type"];
    salary_min: number | null;
    salary_max: number | null;
  };
};

export const MOCK_SAVED_JOBS: SavedJob[] = [
  {
    id: "save-1",
    saved_at: "2026-09-05T09:30:00Z",
    job_details: {
      id: "1",
      title: "Senior Frontend Engineer",
      company_name: "Northwind Labs",
      location: "Bengaluru, IN",
      job_type: "Full-time",
      salary_min: 3_200_000,
      salary_max: 4_800_000,
    },
  },
  {
    id: "save-2",
    saved_at: "2026-09-04T16:45:00Z",
    job_details: {
      id: "5",
      title: "DevOps Engineer",
      company_name: "Northwind Labs",
      location: "Remote",
      job_type: "Full-time",
      salary_min: 3_000_000,
      salary_max: 4_200_000,
    },
  },
  {
    id: "save-3",
    saved_at: "2026-09-02T11:20:00Z",
    job_details: {
      id: "3",
      title: "Backend Engineer, Payments",
      company_name: "Ledgerly",
      location: "Pune, IN",
      job_type: "Full-time",
      salary_min: 2_800_000,
      salary_max: 4_000_000,
    },
  },
  {
    id: "save-4",
    saved_at: "2026-08-29T08:00:00Z",
    job_details: {
      id: "6",
      title: "Technical Writer",
      company_name: "Cobalt Studio",
      location: "Remote",
      job_type: "Part-time",
      salary_min: 720_000,
      salary_max: 900_000,
    },
  },
];

export type MatchedJob = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: Job["job_type"];
  salary_min: number | null;
  salary_max: number | null;
  match_score: number;
};

export const MOCK_MATCHED_JOBS: MatchedJob[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company_name: "Northwind Labs",
    location: "Bengaluru, IN",
    job_type: "Full-time",
    salary_min: 3_200_000,
    salary_max: 4_800_000,
    match_score: 96,
  },
  {
    id: "3",
    title: "Backend Engineer, Payments",
    company_name: "Ledgerly",
    location: "Pune, IN",
    job_type: "Full-time",
    salary_min: 2_800_000,
    salary_max: 4_000_000,
    match_score: 88,
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company_name: "Northwind Labs",
    location: "Remote",
    job_type: "Full-time",
    salary_min: 3_000_000,
    salary_max: 4_200_000,
    match_score: 82,
  },
  {
    id: "7",
    title: "Mobile Engineer",
    company_name: "Acme Corp",
    location: "Bengaluru, IN",
    job_type: "Full-time",
    salary_min: 2_500_000,
    salary_max: 3_800_000,
    match_score: 74,
  },
  {
    id: "4",
    title: "Data Analyst Intern",
    company_name: "Brightpath",
    location: "Hyderabad, IN",
    job_type: "Internship",
    salary_min: 480_000,
    salary_max: 600_000,
    match_score: 68,
  },
  {
    id: "6",
    title: "Technical Writer",
    company_name: "Cobalt Studio",
    location: "Remote",
    job_type: "Part-time",
    salary_min: 720_000,
    salary_max: 900_000,
    match_score: 61,
  },
];
