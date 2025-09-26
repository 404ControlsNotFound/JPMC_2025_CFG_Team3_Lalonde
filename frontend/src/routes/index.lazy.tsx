import { useState } from "react";

import { createLazyFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  DollarSign,
  Eye,
  Filter,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createLazyFileRoute("/")({
  component: DashboardComponent,
});

// TypeScript interfaces
interface ResourceAllocation {
  type: string;
  date: string;
  description: string;
}

interface CaseNote {
  date: string;
  note: string;
  staff: string;
}

interface Tenant {
  id: string;
  name: string;
  room: string;
  age: number;
  welfareStatus: "good" | "fair" | "critical";
  engagement: "high" | "medium" | "low";
  lastInteraction: string;
  resourcesReceived: number;
  eventsAttended: number;
  moveInDate?: string;
  demographics?: string;
  resourceHistory?: ResourceAllocation[];
  caseNotes?: CaseNote[];
}

// Mock data for tenants with proper types
const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "Lim Wei Ming",
    room: "A-201",
    age: 67,
    welfareStatus: "good",
    engagement: "high",
    lastInteraction: "2 days ago",
    resourcesReceived: 12,
    eventsAttended: 8,
    moveInDate: "2023-03-15",
    demographics: "Chinese",
    resourceHistory: [
      { type: "Food", date: "2024-01-12", description: "Weekly groceries" },
      {
        type: "Medical",
        date: "2024-01-08",
        description: "Blood pressure medication",
      },
    ],
    caseNotes: [
      {
        date: "2024-01-14",
        note: "Regular check-in, health is stable",
        staff: "Sarah Wong",
      },
      {
        date: "2024-01-10",
        note: "Attended community lunch event",
        staff: "David Tan",
      },
    ],
  },
  {
    id: "2",
    name: "Siti Aminah",
    room: "B-105",
    age: 45,
    welfareStatus: "fair",
    engagement: "medium",
    lastInteraction: "5 days ago",
    resourcesReceived: 8,
    eventsAttended: 4,
    moveInDate: "2023-07-22",
    demographics: "Malay",
    resourceHistory: [
      {
        type: "Clothing",
        date: "2024-01-11",
        description: "Professional attire for interviews",
      },
      { type: "Food", date: "2024-01-07", description: "Halal meal package" },
    ],
    caseNotes: [
      {
        date: "2024-01-09",
        note: "Looking for employment opportunities",
        staff: "James Lim",
      },
      {
        date: "2024-01-05",
        note: "Attended job skills workshop",
        staff: "Career Counselor",
      },
    ],
  },
  {
    id: "3",
    name: "Chen Kok Wah",
    room: "C-302",
    age: 58,
    welfareStatus: "critical",
    engagement: "low",
    lastInteraction: "2 weeks ago",
    resourcesReceived: 3,
    eventsAttended: 1,
    moveInDate: "2023-11-30",
    demographics: "Chinese",
    resourceHistory: [
      {
        type: "Medical",
        date: "2023-12-15",
        description: "Emergency medical supplies",
      },
      { type: "Food", date: "2023-12-10", description: "Basic food package" },
    ],
    caseNotes: [
      {
        date: "2023-12-28",
        note: "Missed several appointments, requires urgent follow-up",
        staff: "Dr. Priya",
      },
      {
        date: "2023-12-20",
        note: "Showing signs of social withdrawal",
        staff: "Social Worker",
      },
    ],
  },
  {
    id: "4",
    name: "Raj Kumar",
    room: "A-115",
    age: 72,
    welfareStatus: "good",
    engagement: "high",
    lastInteraction: "1 day ago",
    resourcesReceived: 15,
    eventsAttended: 12,
    moveInDate: "2022-09-18",
    demographics: "Indian",
    resourceHistory: [
      {
        type: "Food",
        date: "2024-01-14",
        description: "Vegetarian meal package",
      },
      { type: "Other", date: "2024-01-10", description: "Reading glasses" },
    ],
    caseNotes: [
      {
        date: "2024-01-15",
        note: "Very active in community programs",
        staff: "Sarah Wong",
      },
      {
        date: "2024-01-12",
        note: "Helping other residents settle in",
        staff: "David Tan",
      },
    ],
  },
  {
    id: "5",
    name: "Priya Krishnan",
    room: "A-203",
    age: 29,
    welfareStatus: "good",
    engagement: "high",
    lastInteraction: "3 days ago",
    resourcesReceived: 6,
    eventsAttended: 9,
    moveInDate: "2023-12-01",
    demographics: "Indian",
    resourceHistory: [
      {
        type: "Clothing",
        date: "2024-01-14",
        description: "Professional attire for job interviews",
      },
      {
        type: "Other",
        date: "2024-01-10",
        description: "Computer skills training",
      },
    ],
    caseNotes: [
      {
        date: "2024-01-14",
        note: "Actively job searching, very motivated",
        staff: "Sarah Wong",
      },
      {
        date: "2024-01-10",
        note: "Completed computer literacy course",
        staff: "Tech Trainer",
      },
    ],
  },
  {
    id: "6",
    name: "Ahmad Rahman",
    room: "C-308",
    age: 52,
    welfareStatus: "critical",
    engagement: "low",
    lastInteraction: "1 week ago",
    resourcesReceived: 4,
    eventsAttended: 2,
    moveInDate: "2023-10-15",
    demographics: "Malay",
    resourceHistory: [
      {
        type: "Medical",
        date: "2024-01-05",
        description: "Prescription medication",
      },
      {
        type: "Food",
        date: "2024-01-03",
        description: "Emergency food supplies",
      },
    ],
    caseNotes: [
      {
        date: "2024-01-08",
        note: "Health concerns require immediate attention",
        staff: "Dr. Priya",
      },
      {
        date: "2024-01-05",
        note: "Missed medical appointment",
        staff: "Medical Staff",
      },
    ],
  },
];

function DashboardComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState<Tenant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    welfareStatus: "all",
    engagement: "all",
  });

  // Filter tenants based on search and filters
  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWelfare =
      filters.welfareStatus === "all" ||
      tenant.welfareStatus === filters.welfareStatus;
    const matchesEngagement =
      filters.engagement === "all" || tenant.engagement === filters.engagement;

    return matchesSearch && matchesWelfare && matchesEngagement;
  });

  const handleSelectResident = (residentId: string) => {
    setSelectedResidents((prev) =>
      prev.includes(residentId)
        ? prev.filter((id) => id !== residentId)
        : [...prev, residentId],
    );
  };

  const handleSelectAll = () => {
    if (selectedResidents.length === filteredTenants.length) {
      setSelectedResidents([]);
    } else {
      setSelectedResidents(filteredTenants.map((r) => r.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              New Hope Community Services
            </h1>
            <p className="text-gray-600">
              Resident Welfare Management Dashboard
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Export Report</Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-medium text-white">
              NH
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Residents
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-gray-600">+2 new this quarter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resources Distributed
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,450</div>
                  <p className="text-xs text-gray-600">+23% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Cases
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-gray-600">Requiring attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Engagement Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">73%</div>
                  <p className="text-xs text-gray-600">+0.3 this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Residents Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resident Overview</CardTitle>
                    <CardDescription>
                      Monitor resident welfare status and engagement patterns
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Export Data
                    </Button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="mt-4 flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search residents by name or room..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  {showFilters && (
                    <div className="flex items-center space-x-2">
                      <Select
                        value={filters.welfareStatus}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            welfareStatus: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Welfare Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={filters.engagement}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, engagement: value }))
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Engagement Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {filteredTenants.length} of {mockTenants.length}{" "}
                    residents
                  </p>
                  {selectedResidents.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {selectedResidents.length} selected
                      </span>
                      <Button size="sm" variant="outline">
                        Bulk Action
                      </Button>
                    </div>
                  )}
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedResidents.length ===
                              filteredTenants.length &&
                            filteredTenants.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Welfare Status</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Last Interaction</TableHead>
                      <TableHead>Resources</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.map((tenant) => (
                      <TableRow
                        key={tenant.id}
                        className="cursor-pointer transition-colors hover:bg-gray-50"
                        onClick={() => setSelectedResident(tenant)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedResidents.includes(tenant.id)}
                            onCheckedChange={() =>
                              handleSelectResident(tenant.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {tenant.name}
                        </TableCell>
                        <TableCell>{tenant.room}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tenant.welfareStatus === "good"
                                ? "default"
                                : tenant.welfareStatus === "fair"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={
                              tenant.welfareStatus === "good"
                                ? "bg-green-100 text-green-800"
                                : tenant.welfareStatus === "fair"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {tenant.welfareStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              tenant.engagement === "high"
                                ? "border-blue-500 text-blue-700"
                                : tenant.engagement === "medium"
                                  ? "border-yellow-500 text-yellow-700"
                                  : "border-gray-500 text-gray-700"
                            }
                          >
                            {tenant.engagement}
                          </Badge>
                        </TableCell>
                        <TableCell>{tenant.lastInteraction}</TableCell>
                        <TableCell>{tenant.resourcesReceived}</TableCell>
                        <TableCell>{tenant.eventsAttended}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Resident Detail Modal */}
                <Dialog
                  open={!!selectedResident}
                  onOpenChange={() => setSelectedResident(null)}
                >
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedResident?.name} - Room {selectedResident?.room}
                      </DialogTitle>
                    </DialogHeader>
                    {selectedResident && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Age
                            </label>
                            <p className="text-sm">{selectedResident.age}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Move-in Date
                            </label>
                            <p className="text-sm">
                              {selectedResident.moveInDate || "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Demographics
                            </label>
                            <p className="text-sm">
                              {selectedResident.demographics || "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Last Interaction
                            </label>
                            <p className="text-sm">
                              {selectedResident.lastInteraction}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          <Badge
                            className={
                              selectedResident.welfareStatus === "good"
                                ? "bg-green-100 text-green-800"
                                : selectedResident.welfareStatus === "fair"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {selectedResident.welfareStatus} Welfare Status
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              selectedResident.engagement === "high"
                                ? "border-blue-500 text-blue-700"
                                : selectedResident.engagement === "medium"
                                  ? "border-yellow-500 text-yellow-700"
                                  : "border-gray-500 text-gray-700"
                            }
                          >
                            {selectedResident.engagement} Engagement
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">
                                Resource History
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {selectedResident.resourceHistory ? (
                                <div className="space-y-2">
                                  {selectedResident.resourceHistory.map(
                                    (resource, index) => (
                                      <div key={index} className="text-xs">
                                        <span className="font-medium">
                                          {resource.type}
                                        </span>{" "}
                                        - {resource.date}
                                        <p className="text-gray-600">
                                          {resource.description}
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No resource history available
                                </p>
                              )}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">
                                Case Notes
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {selectedResident.caseNotes ? (
                                <div className="space-y-2">
                                  {selectedResident.caseNotes.map(
                                    (note, index) => (
                                      <div key={index} className="text-xs">
                                        <p className="font-medium">
                                          {note.date} - {note.staff}
                                        </p>
                                        <p className="text-gray-600">
                                          {note.note}
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No case notes available
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Resource Assistant</CardTitle>
                <CardDescription>
                  Ask questions about residents and get AI-powered
                  recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                      💬 Hello! I'm your AI assistant for resident welfare
                      management. You can ask me questions like "Who needs food
                      assistance?" or "Show me residents with low engagement
                      levels."
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Quick Questions
                    </h4>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <Button
                        variant="outline"
                        className="h-auto justify-start p-3 text-left"
                      >
                        Who needs immediate attention?
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto justify-start p-3 text-left"
                      >
                        Show inactive residents
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto justify-start p-3 text-left"
                      >
                        Which residents should receive furniture?
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto justify-start p-3 text-left"
                      >
                        Analyze engagement patterns
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask about residents, resources, or get recommendations..."
                      className="flex-1"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
