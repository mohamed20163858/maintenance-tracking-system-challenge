export interface Equipment {
  _id: string; // Unique identifier for the equipment
  name: string; // Name of the equipment
  location: string; // Physical location of the equipment
  department: "Machining" | "Assembly" | "Packaging" | "Shipping"; // Department to which the equipment belongs
  model: string; // Model number or name
  serialNumber: string; // Serial number (unique identifier)
  installDate: Date; // Date the equipment was installed
  status: "Operational" | "Down" | "Maintenance" | "Retired"; // Current status of the equipment
}
