import { z } from "zod/v4";

/**
 * Customer/Contact Types and Validators
 * Used for CRM functionality
 */

export const customerStatusSchema = z.enum(["active", "inactive", "prospect", "customer"]);
export const customerSourceSchema = z.enum([
  "website",
  "referral",
  "cold-call",
  "social-media",
  "event",
  "partner",
  "other",
]);

export const createCustomerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(50).optional(),
  company: z.string().max(255).optional(),
  jobTitle: z.string().max(100).optional(),

  // Address
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),

  // Social
  website: z.string().url().max(255).optional().or(z.literal("")),
  linkedinUrl: z.string().url().max(255).optional().or(z.literal("")),
  twitterHandle: z.string().max(100).optional(),

  // CRM
  status: customerStatusSchema.default("prospect"),
  source: customerSourceSchema.optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),

  // Assignment
  teamId: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  id: z.string(),
});

export const searchCustomersSchema = z.object({
  query: z.string().optional(),
  status: customerStatusSchema.optional(),
  source: customerSourceSchema.optional(),
  teamId: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const customerNoteSchema = z.object({
  customerId: z.string(),
  content: z.string().min(1, "Note content is required"),
});

export const customerActivitySchema = z.object({
  customerId: z.string(),
  type: z.enum(["call", "email", "meeting", "task"]),
  subject: z.string().min(1, "Subject is required").max(255),
  description: z.string().optional(),
  scheduledAt: z.date().optional(),
});

export type CustomerStatus = z.infer<typeof customerStatusSchema>;
export type CustomerSource = z.infer<typeof customerSourceSchema>;
export type CreateCustomer = z.infer<typeof createCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
export type SearchCustomers = z.infer<typeof searchCustomersSchema>;
export type CustomerNote = z.infer<typeof customerNoteSchema>;
export type CustomerActivity = z.infer<typeof customerActivitySchema>;
