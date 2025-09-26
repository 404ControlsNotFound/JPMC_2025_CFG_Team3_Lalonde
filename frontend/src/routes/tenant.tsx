import { Badge } from "@/components/ui/badge";
import { CalendarHeatmap } from "@/components/ui/calendar-heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import { Home, Mail, Phone } from "lucide-react";

// --- Fake profile + contact info ---
const PROFILE = {
  name: "Daniel Lim",
  phone: "9354 8774",
  email: "daniel.lim@example.com",
  room: "Room 4-217",
  photo: "/images/daniel-lim.jpg",
};

// --- Heatmap setup ---
const JULY_2025_START = new Date("2025-07-01");
const JULY_2025_END = new Date("2025-07-31");

const HEATMAP_VALUES: { date: string; count: number }[] = [
  { date: "2025-07-02", count: 1 },
  { date: "2025-07-05", count: 2 },
  { date: "2025-07-09", count: 1 },
  { date: "2025-07-12", count: 3 },
  { date: "2025-07-15", count: 1 },
  { date: "2025-07-18", count: 2 },
  { date: "2025-07-21", count: 4 },
  { date: "2025-07-24", count: 1 },
  { date: "2025-07-28", count: 2 },
];

const PANEL_COLORS = {
  0: "#E5E7EB",
  1: "#D1FAE5",
  2: "#86EFAC",
  3: "#34D399",
  4: "#10B981",
};

const SUPPORT_LOG: { date: string; items: string }[] = [
  { date: "2025-07-28", items: "2x canned food, 1x toothpaste" },
  { date: "2025-07-21", items: "1x rice (5kg), 1x cereal box" },
  { date: "2025-07-18", items: "3x instant noodles, 1x soap bar" },
  { date: "2025-07-12", items: "1x blanket, 1x towel set" },
  { date: "2025-07-05", items: "2x milk cartons, fruits" },
  { date: "2025-07-02", items: "1x hygiene kit, 1x water bottle" },
];

function TenantPage() {
  return (
    <div className="bg-background min-h-screen px-6 py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[360px,1fr]">
        {/* Profile Card */}
        <Card className="self-start">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Tenant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <img
                src={PROFILE.photo}
                alt={`${PROFILE.name} profile photo`}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-muted"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml;utf8," +
                    encodeURIComponent(
                      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='#e5e7eb'/><circle cx='80' cy='60' r='30' fill='#9ca3af'/><rect x='40' y='100' width='80' height='40' rx='20' fill='#9ca3af'/></svg>`
                    );
                }}
              />
              <div>
                <div className="text-lg font-semibold">{PROFILE.name}</div>
                <Badge variant="secondary" className="mt-1">
                  Active
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Room:</span>
                <span>{PROFILE.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <a
                  href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}
                  className="underline-offset-4 hover:underline"
                >
                  {PROFILE.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="truncate underline-offset-4 hover:underline"
                >
                  {PROFILE.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heatmap & Support Log */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Support Log (Items given previously)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {SUPPORT_LOG.map((entry, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between rounded-lg border p-3"
                  >
                    <div>
                      <div className="font-medium">{entry.date}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.items}
                      </div>
                    </div>
                    <Badge variant="outline">Delivered</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/tenant")({
  component: TenantPage,
});
