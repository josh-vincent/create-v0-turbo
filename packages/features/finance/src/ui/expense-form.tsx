"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createExpenseSchema, type ExpenseCategory } from "../types";

interface ExpenseFormProps {
  onSubmit: (data: z.infer<typeof createExpenseSchema>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<typeof createExpenseSchema>>;
  isLoading?: boolean;
}

const categoryOptions: { value: ExpenseCategory; label: string }[] = [
  { value: "software", label: "Software" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "hr", label: "HR" },
  { value: "travel", label: "Travel" },
  { value: "equipment", label: "Equipment" },
  { value: "other", label: "Other" },
];

export function ExpenseForm({ onSubmit, defaultValues, isLoading }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createExpenseSchema>>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: defaultValues || {
      category: "other",
      date: new Date().toISOString().split("T")[0],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description *
          </label>
          <input
            id="description"
            {...register("description")}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Office supplies, software subscription, etc."
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...register("amount", { valueAsNumber: true })}
                className="w-full pl-8 pr-3 py-2 border rounded-md"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category *
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full px-3 py-2 border rounded-md"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date *
          </label>
          <input
            id="date"
            type="date"
            {...register("date")}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
          )}
        </div>
      </div>

      {/* Optional Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Optional Details</h3>

        <div>
          <label htmlFor="vendor" className="block text-sm font-medium mb-1">
            Vendor
          </label>
          <input
            id="vendor"
            {...register("vendor")}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Company or person name"
          />
        </div>

        <div>
          <label htmlFor="receiptUrl" className="block text-sm font-medium mb-1">
            Receipt URL
          </label>
          <input
            id="receiptUrl"
            type="url"
            {...register("receiptUrl")}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://example.com/receipt.pdf"
          />
          {errors.receiptUrl && (
            <p className="text-sm text-red-500 mt-1">{errors.receiptUrl.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Link to receipt image or PDF stored in cloud storage
          </p>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Additional information about this expense..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Expense"}
        </button>
      </div>
    </form>
  );
}
