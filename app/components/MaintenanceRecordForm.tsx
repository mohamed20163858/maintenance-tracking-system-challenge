"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MaintenanceRecordSchema,
  MaintenanceRecordFormValues,
} from "../types/maintenanceSchema";
import { Equipment } from "../types/equipment"; // Import the Equipment type for fetching

interface MaintenanceFormProps {
  existingMaintenance?: MaintenanceRecordFormValues; // If editing, pass the existing data
  onSubmit: (data: MaintenanceRecordFormValues) => void; // Handle submit
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  existingMaintenance,
  onSubmit,
}) => {
  const [equipmentOptions, setEquipmentOptions] = useState<Equipment[]>([]); // Holds equipment data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<MaintenanceRecordFormValues>({
    resolver: zodResolver(MaintenanceRecordSchema),
    defaultValues: existingMaintenance || {}, // Set default values if editing
  });

  // Populate form fields with existing data when editing
  useEffect(() => {
    if (existingMaintenance) {
      Object.keys(existingMaintenance).forEach((key) => {
        setValue(
          key as keyof MaintenanceRecordFormValues,
          existingMaintenance[key as keyof MaintenanceRecordFormValues]
        );
      });
    }
  }, [existingMaintenance, setValue]);

  // Handle date conversion for existingMaintenance
  useEffect(() => {
    if (
      existingMaintenance &&
      existingMaintenance.date &&
      typeof existingMaintenance.date === "string"
    ) {
      setValue("date", new Date(existingMaintenance.date)); // Convert to Date
    }
  }, [existingMaintenance, setValue]);

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/equipment");
        if (!response.ok) throw new Error("Failed to fetch equipment data");
        const data: Equipment[] = await response.json();
        setEquipmentOptions(data);
        setError(null);
      } catch {
        setError("Could not load equipment data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      {/* Equipment Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="equipmentId"
          className="block text-sm font-medium text-gray-700"
        >
          Equipment
        </label>
        {loading ? (
          <p className="text-sm text-gray-500">Loading equipment...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <select
            id="equipmentId"
            {...register("equipmentId", { required: true })}
            className={`mt-1 block w-full border ${
              errors.equipmentId ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="">Select an equipment</option>
            {equipmentOptions.map((equipment) => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.name} - {equipment.location}
              </option>
            ))}
          </select>
        )}
        {errors.equipmentId && (
          <p className="mt-2 text-sm text-red-500">
            {errors.equipmentId.message}
          </p>
        )}
      </div>

      {/* Date */}
      <div className="mb-4">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => {
            const formattedDate = field.value
              ? new Date(field.value).toISOString().split("T")[0]
              : "";

            return (
              <input
                id="date"
                type="date"
                {...field}
                value={formattedDate} // Ensure date format is YYYY-MM-DD
                onChange={(e) => field.onChange(new Date(e.target.value))}
                className={`mt-1 block w-full border ${
                  errors.date ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
            );
          }}
        />
        {errors.date && (
          <p className="mt-2 text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      {/* Type */}
      <div className="mb-4">
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Type
        </label>
        <select
          id="type"
          {...register("type")}
          className={`mt-1 block w-full border ${
            errors.type ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="">Select a type</option>
          <option value="Preventive">Preventive</option>
          <option value="Repair">Repair</option>
          <option value="Emergency">Emergency</option>
        </select>
        {errors.type && (
          <p className="mt-2 text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Technician */}
      <div className="mb-4">
        <label
          htmlFor="technician"
          className="block text-sm font-medium text-gray-700"
        >
          Technician
        </label>
        <input
          id="technician"
          type="text"
          {...register("technician")}
          className={`mt-1 block w-full border ${
            errors.technician ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.technician && (
          <p className="mt-2 text-sm text-red-500">
            {errors.technician.message}
          </p>
        )}
      </div>

      {/* Hours Spent */}
      <div className="mb-4">
        <label
          htmlFor="hoursSpent"
          className="block text-sm font-medium text-gray-700"
        >
          Hours Spent
        </label>
        <input
          id="hoursSpent"
          type="number"
          {...register("hoursSpent", { valueAsNumber: true })}
          className={`mt-1 block w-full border ${
            errors.hoursSpent ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.hoursSpent && (
          <p className="mt-2 text-sm text-red-500">
            {errors.hoursSpent.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          className={`mt-1 block w-full border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Parts Replaced */}
      <div className="mb-4">
        <label
          htmlFor="partsReplaced"
          className="block text-sm font-medium text-gray-700"
        >
          Parts Replaced (optional)
        </label>
        <input
          id="partsReplaced"
          type="text"
          placeholder="Enter parts separated by commas"
          onChange={(e) => {
            const value = e.target.value.split(",").map((part) => part.trim());
            setValue("partsReplaced", value); // Update the field with an array
          }}
          className={`mt-1 block w-full border ${
            errors.partsReplaced ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.partsReplaced && (
          <p className="mt-2 text-sm text-red-500">
            {errors.partsReplaced.message}
          </p>
        )}
      </div>

      {/* Priority */}
      <div className="mb-4">
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700"
        >
          Priority
        </label>
        <select
          id="priority"
          {...register("priority")}
          className={`mt-1 block w-full border ${
            errors.priority ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="">Select priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.priority && (
          <p className="mt-2 text-sm text-red-500">{errors.priority.message}</p>
        )}
      </div>

      {/* Completion Status */}
      <div className="mb-4">
        <label
          htmlFor="completionStatus"
          className="block text-sm font-medium text-gray-700"
        >
          Completion Status
        </label>
        <select
          id="completionStatus"
          {...register("completionStatus")}
          className={`mt-1 block w-full border ${
            errors.completionStatus ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="">Select completion status</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Pending Parts">Pending Parts</option>
        </select>
        {errors.completionStatus && (
          <p className="mt-2 text-sm text-red-500">
            {errors.completionStatus.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
};

export default MaintenanceForm;
