"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@tocld/ui/dialog";
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Badge } from "@tocld/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tocld/ui/table";
import { InvoiceForm } from "@tocld/features-finance/ui";
import type { z } from "zod";
import type { createInvoiceSchema } from "@tocld/features-finance/types";

export default function InvoicesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Queries
  const { data: invoices, isLoading } = trpc.invoice.list.useQuery({});
  const { data: stats } = trpc.invoice.getStats.useQuery();

  // Mutations
  const createMutation = trpc.invoice.create.useMutation({
    onSuccess: async () => {
      setIsCreateOpen(false);
      await queryClient.invalidateQueries(trpc.invoice.pathFilter());
    },
  });

  const deleteMutation = trpc.invoice.delete.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.invoice.pathFilter());
    },
  });

  const handleCreate = async (data: z.infer<typeof createInvoiceSchema>) => {
    await createMutation.mutateAsync(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">
            Manage your invoices and track payments
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Create Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm
              onSubmit={handleCreate}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Invoices</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Paid Amount</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.paidAmount)}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Outstanding</div>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(stats.totalAmount - stats.paidAmount)}
            </div>
          </Card>
        </div>
      )}

      {/* Invoice List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">All Invoices</h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !invoices || invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invoices found. Create your first invoice to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.clientEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(invoice.id)}
                        disabled={deleteMutation.isPending}
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
