import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SALARY_RANGES = [
  { value: "0-10000", label: "0 – 10,000" },
  { value: "10000-15000", label: "10,000 – 15,000" },
  { value: "15000-20000", label: "15,000 – 20,000" },
  { value: "20000-25000", label: "20,000 – 25,000" },
  { value: "25000+", label: "25,000 onwards" },
];

interface PersonProfile {
  name: string;
  age: number;
  gender: string;
  location: string;
  job_title: string;
  industry: string;
  income_level: string;
  annual_income: number;
  education: string;
  marital_status: string;
  health_conditions: string[];
  lifestyle_factors: string[];
  hobbies: string[];
  family_size: number;
  years_experience: number;
  case_logs: Record<string, string>;
}

function TenantForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PersonProfile>({
    name: "",
    age: 0,
    gender: "",
    location: "",
    job_title: "",
    industry: "",
    income_level: "",
    annual_income: 0,
    education: "",
    marital_status: "",
    health_conditions: [],
    lifestyle_factors: [],
    hobbies: [],
    family_size: 0,
    years_experience: 0,
    case_logs: {},
  });

  const [logs, setLogs] = useState<{ timestamp: string; text: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // optional: reset form and logs
    setForm({
      name: "",
      age: 0,
      gender: "",
      location: "",
      job_title: "",
      industry: "",
      income_level: "",
      annual_income: 0,
      education: "",
      marital_status: "",
      health_conditions: [],
      lifestyle_factors: [],
      hobbies: [],
      family_size: 0,
      years_experience: 0,
      case_logs: {},
    });
    setLogs([]);

    // show success message
    setSuccessMsg("Profile saved successfully. Redirecting to dashboard…");

    // redirect after short delay
    setTimeout(() => {
      navigate({ to: "/" }); // adjust path if your dashboard is different
    }, 2000);

    setIsSubmitting(false);
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Tenant Registration</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Feedback banners */}
            {successMsg && (
              <div
                role="status"
                aria-live="polite"
                className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800"
              >
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div
                role="alert"
                className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800"
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="mb-1.5 block">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="age" className="mb-1.5 block">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min={0}
                      step={1}
                      value={form.age}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          age: parseInt(e.target.value || "0", 10),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" className="mb-1.5 block">
                      Gender
                    </Label>
                    <Input
                      id="gender"
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location" className="mb-1.5 block">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="marital_status" className="mb-1.5 block">
                      Marital Status
                    </Label>
                    <Input
                      id="marital_status"
                      value={form.marital_status}
                      onChange={(e) =>
                        setForm({ ...form, marital_status: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="family_size" className="mb-1.5 block">
                      Family Size
                    </Label>
                    <Input
                      id="family_size"
                      type="number"
                      min={0}
                      step={1}
                      value={form.family_size}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          family_size: parseInt(e.target.value || "0", 10),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Employment & Income */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="job_title" className="mb-1.5 block">
                    Job Title
                  </Label>
                  <Input
                    id="job_title"
                    value={form.job_title}
                    onChange={(e) =>
                      setForm({ ...form, job_title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="industry" className="mb-1.5 block">
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="income_level" className="mb-1.5 block">
                    Annual Income (SGD)
                  </Label>
                  <select
                    id="income_level"
                    value={form.income_level}
                    onChange={(e) =>
                      setForm({ ...form, income_level: e.target.value })
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    required
                  >
                    <option value="" disabled>
                      Select a range…
                    </option>
                    {SALARY_RANGES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="years_experience" className="mb-1.5 block">
                    Years of Experience
                  </Label>
                  <Input
                    id="years_experience"
                    type="number"
                    min={0}
                    step={1}
                    value={form.years_experience}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        years_experience: parseInt(
                          e.target.value || "0",
                          10
                        ),
                      })
                    }
                  />
                </div>
              </div>

              {/* Case Logs */}
              <div className="space-y-4">
                <Label className="mb-2 block">Case Logs</Label>
                {logs.map((log, index) => (
                  <div key={index} className="flex flex-col gap-3 md:flex-row">
                    <Input
                      type="datetime-local"
                      value={log.timestamp}
                      onChange={(e) => {
                        const newLogs = [...logs];
                        newLogs[index].timestamp = e.target.value;
                        setLogs(newLogs);
                      }}
                      className="md:max-w-xs"
                    />
                    <Textarea
                      value={log.text}
                      onChange={(e) => {
                        const newLogs = [...logs];
                        newLogs[index].text = e.target.value;
                        setLogs(newLogs);
                      }}
                      placeholder="Log entry..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        const newLogs = [...logs];
                        newLogs.splice(index, 1);
                        setLogs(newLogs);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setLogs([...logs, { timestamp: "", text: "" }])
                  }
                >
                  Add Log Entry
                </Button>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm({
                      name: "",
                      age: 0,
                      gender: "",
                      location: "",
                      job_title: "",
                      industry: "",
                      income_level: "",
                      annual_income: 0,
                      education: "",
                      marital_status: "",
                      health_conditions: [],
                      lifestyle_factors: [],
                      hobbies: [],
                      family_size: 0,
                      years_experience: 0,
                      case_logs: {},
                    });
                    setLogs([]);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                >
                  Clear
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving…" : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/tenant_form")({
  component: TenantForm,
});
