import { z } from "zod";

// Zod validation schema
export const MaintenanceRecordSchema = z.object({
  equipmentId: z.string().min(1, { message: "Equipment is required" }), // Equipment dropdown
  date: z.date().refine((d) => d <= new Date(), {
    message: "Date cannot be in the future",
  }), // Required, not a future date
  type: z.enum(["Preventive", "Repair", "Emergency"], {
    errorMap: () => ({ message: "Invalid type selected" }),
  }), // Type dropdown
  technician: z
    .string()
    .min(2, { message: "Technician name must be at least 2 characters" }), // Required, min 2 chars
  hoursSpent: z
    .number()
    .positive({ message: "Hours must be a positive number" })
    .max(24, { message: "Hours cannot exceed 24" }), // Required, positive, max 24
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }), // Required, min 10 chars
  partsReplaced: z.array(z.string()).optional(), // Optional array of strings
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Invalid priority selected" }),
  }), // Priority dropdown
  completionStatus: z.enum(["Complete", "Incomplete", "Pending Parts"], {
    errorMap: () => ({ message: "Invalid completion status selected" }),
  }), // Completion Status dropdown
});

// Type inference from Zod schema
export type MaintenanceRecordFormValues = z.infer<
  typeof MaintenanceRecordSchema
>;
