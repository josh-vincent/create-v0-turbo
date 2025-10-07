"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@tocld/ui/dialog";
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Badge } from "@tocld/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tocld/ui/table";
import { ExpenseForm } from "@tocld/features-finance/ui";
import type { z } from "zod";
import type { createExpenseSchema } from "@tocld/features-finance/types";

export default function ExpensesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Queries
  const { data: expenses, isLoading } = trpc.expense.list.useQuery({});
  const { data: stats } = trpc.expense.getStats.useQuery();

  // Mutations
  const createMutation = trpc.expense.create.useMutation({
    onSuccess: async () => {
      setIsCreateOpen(false);
      await queryClient.invalidateQueries(trpc.expense.pathFilter());
    },
  });

  const deleteMutation = trpc.expense.delete.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.expense.pathFilter());
    },
  });

  const handleCreate = async (data: z.infer<typeof createExpenseSchema>) => {
    await createMutation.mutateAsync(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "software":
        return "bg-blue-100 text-blue-800";
      case "marketing":
        return "bg-purple-100 text-purple-800";
      case "operations":
        return "bg-green-100 text-green-800";
      case "hr":
        return "bg-pink-100 text-pink-800";
      case "travel":
        return "bg-indigo-100 text-indigo-800";
      case "equipment":
        return "bg-orange-100 text-orange-800";
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
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">
            Track and manage your business expenses
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Add Expense</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm
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
            <div className="text-sm font-medium text-muted-foreground">Total Expenses</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Average Expense</div>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageExpense)}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Categories</div>
            <div className="text-2xl font-bold">
              {Object.keys(stats.byCategory).length}
            </div>
          </Card>
        </div>
      )}

      {/* Category Breakdown */}
      {stats && Object.keys(stats.byCategory).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stats.byCategory).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(category)}>
                    {category}
                  </Badge>
                </div>
                <div className="font-semibold">{formatCurrency(amount)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Expense List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !expenses || expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No expenses found. Add your first expense to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(expense.category)}>
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {expense.vendor ? (
                        <span>{expense.vendor}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {expense.receiptUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer">
                              Receipt
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
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
