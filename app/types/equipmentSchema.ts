import { z } from "zod";

// Define the Zod schema for equipment validation
export const equipmentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(1, "Location is required"),
  department: z.enum(["Machining", "Assembly", "Packaging", "Shipping"]),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().regex(/^[a-zA-Z0-9]+$/, "Invalid serial number"),
  installDate: z
    .date()
    .refine((date) => date < new Date(), "Install date must be in the past"),
  status: z.enum(["Operational", "Down", "Maintenance", "Retired"]),
});

// Define the inferred TypeScript type from the Zod schema
export type EquipmentFormValues = z.infer<typeof equipmentSchema>;
