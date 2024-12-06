"use client";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema, EquipmentFormValues } from "../types/equipmentSchema";

const EquipmentForm: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
  });

  const onSubmit = async (data: EquipmentFormValues) => {
    try {
      const response = await fetch(`http://localhost:3001/equipment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        // Redirect to /equipment after successful submission
      });

      if (!response.ok) {
        throw new Error("Failed to save equipment data");
      }
      router.push("/equipment");
    } catch (error) {
      throw new Error("Failed to connect to the server");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      {/* Name */}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`mt-1 block w-full border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Location */}
      <div className="mb-4">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          id="location"
          type="text"
          {...register("location")}
          className={`mt-1 block w-full border ${
            errors.location ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.location && (
          <p className="mt-2 text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      {/* Department */}
      <div className="mb-4">
        <label
          htmlFor="department"
          className="block text-sm font-medium text-gray-700"
        >
          Department
        </label>
        <select
          id="department"
          {...register("department")}
          className={`mt-1 block w-full border ${
            errors.department ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="">Select a department</option>
          <option value="Machining">Machining</option>
          <option value="Assembly">Assembly</option>
          <option value="Packaging">Packaging</option>
          <option value="Shipping">Shipping</option>
        </select>
        {errors.department && (
          <p className="mt-2 text-sm text-red-500">
            {errors.department.message}
          </p>
        )}
      </div>

      {/* Model */}
      <div className="mb-4">
        <label
          htmlFor="model"
          className="block text-sm font-medium text-gray-700"
        >
          Model
        </label>
        <input
          id="model"
          type="text"
          {...register("model")}
          className={`mt-1 block w-full border ${
            errors.model ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.model && (
          <p className="mt-2 text-sm text-red-500">{errors.model.message}</p>
        )}
      </div>

      {/* Serial Number */}
      <div className="mb-4">
        <label
          htmlFor="serialNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Serial Number
        </label>
        <input
          id="serialNumber"
          type="text"
          {...register("serialNumber")}
          className={`mt-1 block w-full border ${
            errors.serialNumber ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.serialNumber && (
          <p className="mt-2 text-sm text-red-500">
            {errors.serialNumber.message}
          </p>
        )}
      </div>

      {/* Install Date */}
      <div className="mb-4">
        <label
          htmlFor="installDate"
          className="block text-sm font-medium text-gray-700"
        >
          Install Date
        </label>
        <Controller
          name="installDate"
          control={control}
          render={({ field }) => (
            <input
              id="installDate"
              type="date"
              {...field}
              value={
                field.value instanceof Date
                  ? field.value.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => field.onChange(new Date(e.target.value))}
              className={`mt-1 block w-full border ${
                errors.installDate ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
            />
          )}
        />
        {errors.installDate && (
          <p className="mt-2 text-sm text-red-500">
            {errors.installDate.message}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className={`mt-1 block w-full border ${
            errors.status ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="">Select a status</option>
          <option value="Operational">Operational</option>
          <option value="Down">Down</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Retired">Retired</option>
        </select>
        {errors.status && (
          <p className="mt-2 text-sm text-red-500">{errors.status.message}</p>
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

export default EquipmentForm;
