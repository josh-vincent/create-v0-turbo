"use client";

import { api } from "~/trpc/react";
import { Card } from "@tocld/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tocld/ui/table";
import { TimeTracker } from "@tocld/features-finance/ui";
import { Badge } from "@tocld/ui/badge";
import { Button } from "@tocld/ui/button";

export default function TimePage() {
  const utils = api.useUtils();

  // Queries
  const { data: entries, isLoading } = api.time.list.useQuery({});
  const { data: runningTimer } = api.time.getRunning.useQuery();
  const { data: stats } = api.time.getStats.useQuery({});

  // Mutations
  const startMutation = api.time.start.useMutation({
    onSuccess: () => {
      utils.time.getRunning.invalidate();
      utils.time.list.invalidate();
    },
  });

  const stopMutation = api.time.stop.useMutation({
    onSuccess: () => {
      utils.time.getRunning.invalidate();
      utils.time.list.invalidate();
      utils.time.getStats.invalidate();
    },
  });

  const deleteMutation = api.time.delete.useMutation({
    onSuccess: () => {
      utils.time.list.invalidate();
      utils.time.getStats.invalidate();
    },
  });

  const handleStart = async (data: {
    projectName: string;
    description: string;
    hourlyRate?: number;
    billable: boolean;
  }) => {
    await startMutation.mutateAsync(data);
  };

  const handleStop = async (id: string) => {
    await stopMutation.mutateAsync({ id });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this time entry?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Time Tracking</h2>
        <p className="text-muted-foreground">
          Track time spent on projects and tasks
        </p>
      </div>

      {/* Timer */}
      <TimeTracker
        onStart={handleStart}
        onStop={handleStop}
        runningTimer={runningTimer}
        isLoading={startMutation.isPending || stopMutation.isPending}
      />

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Entries</div>
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Hours</div>
            <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Billable Hours</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.billableHours.toFixed(1)}h
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Non-Billable</div>
            <div className="text-2xl font-bold text-gray-600">
              {stats.nonBillableHours.toFixed(1)}h
            </div>
          </Card>
        </div>
      )}

      {/* Time by Project */}
      {stats && stats.byProject.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Time by Project</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.byProject.map(({ project, hours }) => (
              <div key={project} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="font-medium">{project}</div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {hours.toFixed(1)}h
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Time Entries List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Time Entries</h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !entries || entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No time entries found. Start a timer to track your first entry.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.projectName}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-sm">{formatDate(entry.startTime)}</TableCell>
                    <TableCell className="text-sm">
                      {entry.endTime ? (
                        formatDate(entry.endTime)
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Running</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDuration(entry.duration)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          entry.billable
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {entry.billable ? "Billable" : "Non-billable"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        disabled={deleteMutation.isPending || entry.endTime === null}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
