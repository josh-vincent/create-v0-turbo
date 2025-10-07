"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTimeEntrySchema } from "../types";

interface TimeTrackerProps {
  onStart: (data: { projectName: string; description: string; hourlyRate?: number; billable: boolean }) => void | Promise<void>;
  onStop: (id: string) => void | Promise<void>;
  runningTimer?: {
    id: string;
    projectName: string;
    description: string;
    startTime: Date;
    hourlyRate: string | null;
    billable: boolean;
  } | null;
  isLoading?: boolean;
}

export function TimeTracker({ onStart, onStop, runningTimer, isLoading }: TimeTrackerProps) {
  const [elapsed, setElapsed] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: "",
      description: "",
      hourlyRate: undefined as number | undefined,
      billable: true,
    },
  });

  // Update elapsed time for running timer
  useEffect(() => {
    if (!runningTimer) {
      setElapsed(0);
      return;
    }

    const updateElapsed = () => {
      const now = new Date();
      const start = new Date(runningTimer.startTime);
      const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
      setElapsed(diff);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [runningTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = (data: any) => {
    onStart({
      projectName: data.projectName,
      description: data.description,
      hourlyRate: data.hourlyRate || undefined,
      billable: data.billable,
    });
    reset();
    setShowForm(false);
  };

  const handleStopTimer = () => {
    if (runningTimer) {
      onStop(runningTimer.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Running Timer Display */}
      {runningTimer ? (
        <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-600">Timer Running</span>
            </div>
            <button
              onClick={handleStopTimer}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? "Stopping..." : "Stop Timer"}
            </button>
          </div>

          <div className="text-center mb-4">
            <div className="text-5xl font-mono font-bold text-gray-800">
              {formatTime(elapsed)}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Project:</span>
              <span className="font-medium">{runningTimer.projectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Task:</span>
              <span className="font-medium">{runningTimer.description}</span>
            </div>
            {runningTimer.hourlyRate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">${runningTimer.hourlyRate}/hr</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Billable:</span>
              <span className={`font-medium ${runningTimer.billable ? "text-green-600" : "text-gray-500"}`}>
                {runningTimer.billable ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Start Timer Form */
        <div className="border rounded-lg p-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium"
            >
              Start New Timer
            </button>
          ) : (
            <form onSubmit={handleSubmit(handleStartTimer)} className="space-y-4">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium mb-1">
                  Project Name *
                </label>
                <input
                  id="projectName"
                  {...register("projectName", { required: "Project name is required" })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="E-commerce Redesign"
                />
                {errors.projectName && (
                  <p className="text-sm text-red-500 mt-1">{errors.projectName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Task Description *
                </label>
                <input
                  id="description"
                  {...register("description", { required: "Description is required" })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Frontend development - Product page"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium mb-1">
                    Hourly Rate (optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      id="hourlyRate"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("hourlyRate", { valueAsNumber: true })}
                      className="w-full pl-8 pr-3 py-2 border rounded-md"
                      placeholder="150.00"
                    />
                  </div>
                </div>

                <div className="flex items-center pt-6">
                  <input
                    id="billable"
                    type="checkbox"
                    {...register("billable")}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="billable" className="ml-2 text-sm font-medium">
                    Billable
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? "Starting..." : "Start Timer"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
