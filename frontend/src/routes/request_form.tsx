import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ItemRequest {
  person_name: string;
  description: string;
  notes: string;
  needed_by: string; // ISO date (YYYY-MM-DD or datetime)
}

function ItemRequestForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ItemRequest>({
    person_name: "",
    description: "",
    notes: "",
    needed_by: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMsg(null);

  // reset form
  setForm({ person_name: "", description: "", notes: "", needed_by: "" });

  // show success + redirect
  setSuccessMsg("Request submitted successfully. Redirecting to dashboard…");
  setTimeout(() => {
    navigate({ to: "/" }); // adjust if your dashboard route differs
  }, 2000);

  setIsSubmitting(false);
};

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Item Request</CardTitle>
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
              {/* Top row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="person_name" className="mb-1.5 block">
                    Person Name *
                  </Label>
                  <Input
                    id="person_name"
                    value={form.person_name}
                    onChange={(e) =>
                      setForm({ ...form, person_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="needed_by" className="mb-1.5 block">
                    Date Needed By *
                  </Label>
                  <Input
                    id="needed_by"
                    type="date"
                    value={form.needed_by}
                    onChange={(e) =>
                      setForm({ ...form, needed_by: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="mb-1.5 block">
                  Description of Needs *
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="What is needed and why?"
                  rows={5}
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="mb-1.5 block">
                  Other Notes
                </Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional details (budget, constraints, etc.)"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setForm({
                      person_name: "",
                      description: "",
                      notes: "",
                      needed_by: "",
                    })
                  }
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/request_form")({
  component: ItemRequestForm,
});
