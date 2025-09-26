import { useState } from "react";
import * as XLSX from "xlsx";

import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  DollarSign,
  Eye,
  Filter,
  Search,
  TrendingUp,
  Users,
  X,
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
  id: number;
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
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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

export function DashboardTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState<Tenant | null>(null);
  const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    welfareStatus: "all",
    engagement: "all",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Helper function to parse relative time for sorting
  const parseRelativeTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)\s*(day|week|hour|minute)s?\s*ago/);
    if (!match) return 0;

    const [, amount, unit] = match;
    const num = parseInt(amount, 10);

    switch (unit) {
      case 'minute': return num;
      case 'hour': return num * 60;
      case 'day': return num * 24 * 60;
      case 'week': return num * 7 * 24 * 60;
      default: return 0;
    }
  };

  // Sort tenants function
  const sortTenants = (tenants: Tenant[]) => {
    if (!sortConfig.key) return tenants;

    return [...tenants].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "room":
          aValue = a.room.toLowerCase();
          bValue = b.room.toLowerCase();
          break;
        case "welfareStatus":
          // Custom order: critical (0) -> fair (1) -> good (2)
          const welfareOrder = { critical: 0, fair: 1, good: 2 };
          aValue = welfareOrder[a.welfareStatus];
          bValue = welfareOrder[b.welfareStatus];
          break;
        case "engagement":
          // Custom order: low (0) -> medium (1) -> high (2)
          const engagementOrder = { low: 0, medium: 1, high: 2 };
          aValue = engagementOrder[a.engagement];
          bValue = engagementOrder[b.engagement];
          break;
        case "lastInteraction":
          aValue = parseRelativeTime(a.lastInteraction);
          bValue = parseRelativeTime(b.lastInteraction);
          break;
        case "resourcesReceived":
          aValue = a.resourcesReceived;
          bValue = b.resourcesReceived;
          break;
        case "eventsAttended":
          aValue = a.eventsAttended;
          bValue = b.eventsAttended;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter and sort tenants based on search, filters, and sorting
  const filteredTenants = sortTenants(
    mockTenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.room.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWelfare =
        filters.welfareStatus === "all" ||
        tenant.welfareStatus === filters.welfareStatus;
      const matchesEngagement =
        filters.engagement === "all" || tenant.engagement === filters.engagement;

      return matchesSearch && matchesWelfare && matchesEngagement;
    })
  );

  const handleSelectResident = (residentId: number) => {
    setSelectedResidents((prev) =>
      prev.includes(residentId)
        ? prev.filter((id) => id !== residentId)
        : [...prev, residentId],
    );
  };

  // Helper component for sortable table headers
  const SortableTableHead = ({
    children,
    sortKey,
    className = ""
  }: {
    children: React.ReactNode;
    sortKey: string;
    className?: string;
  }) => {
    const getSortIcon = () => {
      if (sortConfig.key !== sortKey) {
        return <ChevronsUpDown className="ml-1 h-3 w-3 text-gray-400" />;
      }
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="ml-1 h-3 w-3 text-blue-600" />
      ) : (
        <ChevronDown className="ml-1 h-3 w-3 text-blue-600" />
      );
    };

    return (
      <TableHead
        className={`cursor-pointer select-none hover:bg-gray-50 ${className}`}
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center">
          {children}
          {getSortIcon()}
        </div>
      </TableHead>
    );
  };

  const handleSelectAll = () => {
    if (selectedResidents.length === filteredTenants.length) {
      setSelectedResidents([]);
    } else {
      setSelectedResidents(filteredTenants.map((r) => r.id));
    }
  };

  // Helper function to check if filters are active
  const hasActiveFilters = () => {
    return filters.welfareStatus !== "all" || filters.engagement !== "all" || searchTerm.trim() !== "";
  };

  // Helper function to clear all filters
  const clearAllFilters = () => {
    setFilters({ welfareStatus: "all", engagement: "all" });
    setSearchTerm("");
  };

  // Helper function to get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.welfareStatus !== "all") count++;
    if (filters.engagement !== "all") count++;
    if (searchTerm.trim() !== "") count++;
    return count;
  };

  // Excel export function
  const handleExportToExcel = () => {
    // Prepare data for export (using filtered data)
    const exportData = filteredTenants.map((tenant) => ({
      "Name": tenant.name,
      "Room": tenant.room,
      "Age": tenant.age,
      "Welfare Status": tenant.welfareStatus,
      "Engagement Level": tenant.engagement,
      "Last Interaction": tenant.lastInteraction,
      "Resources Received": tenant.resourcesReceived,
      "Events Attended": tenant.eventsAttended,
      "Move-in Date": tenant.moveInDate || "N/A",
      "Demographics": tenant.demographics || "N/A"
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths for better formatting
    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 10 }, // Room
      { wch: 6 },  // Age
      { wch: 15 }, // Welfare Status
      { wch: 15 }, // Engagement Level
      { wch: 18 }, // Last Interaction
      { wch: 12 }, // Resources Received
      { wch: 12 }, // Events Attended
      { wch: 12 }, // Move-in Date
      { wch: 15 }, // Demographics
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Residents");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `residents-export-${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="space-y-6">
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
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
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
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleExportToExcel}
            >
              Export Data
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 space-y-3">
            {/* Search Bar with Active Filter Indicator */}
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search residents by name or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 ${hasActiveFilters() ? 'ring-2 ring-blue-100 border-blue-300' : ''}`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Active Filter Indicator */}
              {hasActiveFilters() && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>Filter by:</span>
              </div>

              <Select
                value={filters.welfareStatus}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    welfareStatus: value,
                  }))
                }
              >
                <SelectTrigger className={`w-36 h-9 ${filters.welfareStatus !== "all" ? 'ring-2 ring-blue-100 border-blue-300 bg-blue-50' : ''}`}>
                  <SelectValue />
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
                  setFilters((prev) => ({
                    ...prev,
                    engagement: value,
                  }))
                }
              >
                <SelectTrigger className={`w-36 h-9 ${filters.engagement !== "all" ? 'ring-2 ring-blue-100 border-blue-300 bg-blue-50' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredTenants.length} of {mockTenants.length} residents
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
                      selectedResidents.length === filteredTenants.length &&
                      filteredTenants.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <SortableTableHead sortKey="name">Name</SortableTableHead>
                <SortableTableHead sortKey="room">Room</SortableTableHead>
                <SortableTableHead sortKey="welfareStatus">Welfare Status</SortableTableHead>
                <SortableTableHead sortKey="engagement">Engagement</SortableTableHead>
                <SortableTableHead sortKey="lastInteraction">Last Interaction</SortableTableHead>
                <SortableTableHead sortKey="resourcesReceived">Resources</SortableTableHead>
                <SortableTableHead sortKey="eventsAttended">Events</SortableTableHead>
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
                      onCheckedChange={() => handleSelectResident(tenant.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
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
                        <CardTitle className="text-sm">Case Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedResident.caseNotes ? (
                          <div className="space-y-2">
                            {selectedResident.caseNotes.map((note, index) => (
                              <div key={index} className="text-xs">
                                <p className="font-medium">
                                  {note.date} - {note.staff}
                                </p>
                                <p className="text-gray-600">{note.note}</p>
                              </div>
                            ))}
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
    </div>
  );
}
