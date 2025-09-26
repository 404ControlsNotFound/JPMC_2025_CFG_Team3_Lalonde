import { createLazyFileRoute } from "@tanstack/react-router";
import { AlertTriangle, DollarSign, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

// Mock data for tenants
const mockTenants = [
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
  },
];

function DashboardComponent() {
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-screen w-64 border-r border-gray-200 bg-white p-4">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search Residents
              </label>
              <Input
                placeholder="Search by name or room..."
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Welfare Status
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Engagement Level
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Apply Filters
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
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
                  <CardTitle>Resident Overview</CardTitle>
                  <CardDescription>
                    Monitor resident welfare status and engagement patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Welfare Status</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Last Interaction</TableHead>
                        <TableHead>Resources</TableHead>
                        <TableHead>Events</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTenants.map((tenant) => (
                        <TableRow key={tenant.id}>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                        management. You can ask me questions like "Who needs
                        food assistance?" or "Show me residents with low
                        engagement levels."
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
    </div>
  );
}
