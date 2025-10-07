"use client";

import { Download } from "lucide-react";

// Mock invoice data - would typically come from API
const mockInvoices = [
  {
    id: "inv_001",
    date: "2024-01-01",
    amount: "$29.00",
    status: "paid",
    pdfUrl: "#",
  },
  {
    id: "inv_002",
    date: "2023-12-01",
    amount: "$29.00",
    status: "paid",
    pdfUrl: "#",
  },
  {
    id: "inv_003",
    date: "2023-11-01",
    amount: "$29.00",
    status: "paid",
    pdfUrl: "#",
  },
];

export function InvoicesTable() {
  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-muted/30">
                <td className="px-6 py-4 text-sm">
                  {new Date(invoice.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-sm font-medium">{invoice.amount}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <a
                    href={invoice.pdfUrl}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
