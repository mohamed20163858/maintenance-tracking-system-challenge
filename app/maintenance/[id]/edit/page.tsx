// app/maintenance/[id]/edit/page.tsx
"use client"; // Client-side component

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Using useParams from Next.js App Router
import MaintenanceForm from "../../../components/MaintenanceRecordForm";
import { MaintenanceRecord } from "../../../types/maintenance";

const EditMaintenancePage = () => {
  const { id } = useParams(); // Get dynamic route parameter
  const [maintenance, setMaintenance] = useState<MaintenanceRecord | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchMaintenance = async () => {
        try {
          const BACKEND_URL =
            process.env.BACKEND_URL ||
            "https://maintenance-fake-data.vercel.app";
          const response = await fetch(`${BACKEND_URL}/maintenance/${id}`);
          const data = await response.json();
          if (response.ok) {
            setMaintenance(data);
          } else {
            setError("Failed to fetch maintenance data");
          }
        } catch {
          setError("Failed to fetch maintenance data");
        } finally {
          setLoading(false);
        }
      };

      fetchMaintenance();
    }
  }, [id]);

  const handleUpdate = async (data: Omit<MaintenanceRecord, "id">) => {
    try {
      const recordWithId = { id, ...data }; // Add the `id` back
      const BACKEND_URL =
        process.env.BACKEND_URL || "https://maintenance-fake-data.vercel.app";
      const response = await fetch(`${BACKEND_URL}/maintenance/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recordWithId),
      });

      if (!response.ok) {
        throw new Error("Failed to update maintenance record");
      }

      // Redirect after successful update
      alert("Record updated successfully");
      window.location.href = "/maintenance";
    } catch {
      alert("Failed to update maintenance record");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Maintenance Record Update Form
        </h1>
        <MaintenanceForm
          existingMaintenance={maintenance}
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  );
};

export default EditMaintenancePage;
