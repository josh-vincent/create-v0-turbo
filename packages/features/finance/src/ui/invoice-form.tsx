"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createInvoiceSchema, type InvoiceStatus } from "../types";

// This component is meant to be used with your UI library
// It demonstrates the structure and logic needed for an invoice form

interface InvoiceFormProps {
  onSubmit: (data: z.infer<typeof createInvoiceSchema>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<typeof createInvoiceSchema>>;
  isLoading?: boolean;
}

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export function InvoiceForm({ onSubmit, defaultValues, isLoading }: InvoiceFormProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>(
    defaultValues?.items || [{ description: "", quantity: 1, rate: 0, amount: 0 }]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof createInvoiceSchema>>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: defaultValues || {
      status: "draft",
      items: [],
      subtotal: 0,
      total: 0,
    },
  });

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    const updated = lineItems.filter((_, i) => i !== index);
    setLineItems(updated);
    updateTotals(updated);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index]!, [field]: value };

    // Calculate amount for this line item
    if (field === "quantity" || field === "rate") {
      const quantity = field === "quantity" ? Number(value) : updated[index]!.quantity;
      const rate = field === "rate" ? Number(value) : updated[index]!.rate;
      updated[index]!.amount = quantity * rate;
    }

    setLineItems(updated);
    updateTotals(updated);
  };

  const updateTotals = (items: LineItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = watch("tax") || 0;
    const total = subtotal + tax;

    setValue("items", items);
    setValue("subtotal", subtotal);
    setValue("total", total);
  };

  const handleTaxChange = (taxValue: number) => {
    setValue("tax", taxValue);
    const subtotal = watch("subtotal") || 0;
    setValue("total", subtotal + taxValue);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Client Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium mb-1">
              Client Name *
            </label>
            <input
              id="clientName"
              {...register("clientName")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Acme Corp"
            />
            {errors.clientName && (
              <p className="text-sm text-red-500 mt-1">{errors.clientName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium mb-1">
              Client Email *
            </label>
            <input
              id="clientEmail"
              type="email"
              {...register("clientEmail")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="billing@acme.com"
            />
            {errors.clientEmail && (
              <p className="text-sm text-red-500 mt-1">{errors.clientEmail.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Invoice Details</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="invoiceNumber" className="block text-sm font-medium mb-1">
              Invoice Number *
            </label>
            <input
              id="invoiceNumber"
              {...register("invoiceNumber")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="INV-001"
            />
            {errors.invoiceNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.invoiceNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="issueDate" className="block text-sm font-medium mb-1">
              Issue Date *
            </label>
            <input
              id="issueDate"
              type="date"
              {...register("issueDate")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.issueDate && (
              <p className="text-sm text-red-500 mt-1">{errors.issueDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
              Due Date *
            </label>
            <input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500 mt-1">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Line Items</h3>
          <button
            type="button"
            onClick={addLineItem}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {lineItems.map((item, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[2fr,1fr,1fr,1fr,auto] items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  value={item.description}
                  onChange={(e) => updateLineItem(index, "description", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Service description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rate</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateLineItem(index, "rate", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="text"
                  value={`$${item.amount.toFixed(2)}`}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                />
              </div>

              <button
                type="button"
                onClick={() => removeLineItem(index)}
                className="px-3 py-2 text-red-500 border border-red-200 rounded-md hover:bg-red-50"
                disabled={lineItems.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 max-w-xs ml-auto">
        <div className="flex justify-between">
          <span className="text-sm">Subtotal:</span>
          <span className="font-medium">${(watch("subtotal") || 0).toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <label htmlFor="tax" className="text-sm">Tax:</label>
          <input
            id="tax"
            type="number"
            min="0"
            step="0.01"
            {...register("tax", { valueAsNumber: true })}
            onChange={(e) => handleTaxChange(Number(e.target.value))}
            className="w-24 px-2 py-1 border rounded-md text-right"
            placeholder="0.00"
          />
        </div>

        <div className="flex justify-between border-t pt-2">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg">${(watch("total") || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Payment terms, additional information..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Invoice"}
        </button>
      </div>
    </form>
  );
}
