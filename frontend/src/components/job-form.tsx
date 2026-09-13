import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Job } from "@/lib/mock-data";

export const JOB_TYPES: Job["job_type"][] = ["Full-time", "Part-time", "Contract", "Internship"];

export type JobFormValues = {
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: Job["job_type"];
  salary_min: string;
  salary_max: string;
};

export const EMPTY_JOB_FORM: JobFormValues = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  job_type: "Full-time",
  salary_min: "",
  salary_max: "",
};

type Errors = Partial<Record<keyof JobFormValues, string>>;

export function JobForm({
  mode,
  initialValues,
  jobId,
}: {
  mode: "create" | "edit";
  initialValues: JobFormValues;
  jobId?: string;
}) {
  const [form, setForm] = useState<JobFormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function handleChange<K extends keyof JobFormValues>(field: K, value: JobFormValues[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsSaved(false);
  }

  function validate(values: JobFormValues): Errors {
    const next: Errors = {};
    if (!values.title.trim()) next.title = "Title is required.";
    if (!values.description.trim()) next.description = "Description is required.";

    const min = values.salary_min.trim() === "" ? null : Number(values.salary_min);
    const max = values.salary_max.trim() === "" ? null : Number(values.salary_max);
    if (min !== null && Number.isNaN(min)) next.salary_min = "Enter a valid number.";
    if (max !== null && Number.isNaN(max)) next.salary_max = "Enter a valid number.";
    if (min !== null && max !== null && !Number.isNaN(min) && !Number.isNaN(max) && max <= min) {
      next.salary_max = "Maximum salary must be greater than the minimum.";
    }
    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      requirements: form.requirements
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      location: form.location.trim(),
      job_type: form.job_type,
      salary_min: form.salary_min.trim() === "" ? null : Number(form.salary_min),
      salary_max: form.salary_max.trim() === "" ? null : Number(form.salary_max),
    };

    // Mock request. Wire up POST /api/jobs/ (create) or PATCH /api/jobs/:id/ (edit).
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (mode === "create") {
      console.log("POST /api/jobs/", payload);
    } else {
      console.log(`PATCH /api/jobs/${jobId}/`, payload);
    }

    setIsSubmitting(false);
    setIsSaved(true);
  }

  return (
    <>
      {isSaved && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="size-4" />
          {mode === "create" ? "Job posting created." : "Job posting updated."}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label htmlFor="title">
            Job title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(event) => handleChange("title", event.target.value)}
            placeholder="Senior Frontend Engineer"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            placeholder="What will this person own day to day?"
            rows={6}
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            value={form.requirements}
            onChange={(event) => handleChange("requirements", event.target.value)}
            placeholder={"One per line, e.g.\n5+ years with React\nStrong TypeScript skills"}
            rows={5}
          />
          <p className="text-xs text-muted-foreground">One requirement per line.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(event) => handleChange("location", event.target.value)}
              placeholder="Remote or Bengaluru, IN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_type">Job type</Label>
            <select
              id="job_type"
              value={form.job_type}
              onChange={(event) => handleChange("job_type", event.target.value as Job["job_type"])}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="salary_min">Minimum salary (₹ / year)</Label>
            <Input
              id="salary_min"
              type="number"
              min={0}
              value={form.salary_min}
              onChange={(event) => handleChange("salary_min", event.target.value)}
              placeholder="1800000"
              aria-invalid={Boolean(errors.salary_min)}
            />
            {errors.salary_min && <p className="text-xs text-destructive">{errors.salary_min}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary_max">Maximum salary (₹ / year)</Label>
            <Input
              id="salary_max"
              type="number"
              min={0}
              value={form.salary_max}
              onChange={(event) => handleChange("salary_max", event.target.value)}
              placeholder="2600000"
              aria-invalid={Boolean(errors.salary_max)}
            />
            {errors.salary_max && <p className="text-xs text-destructive">{errors.salary_max}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Publish job posting"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </>
  );
}
