// app/equipment/[id]/edit/page.tsx
"use client"; // Client-side component

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Using useParams from Next.js App Router
import EquipmentForm from "../../../components/EquipmentForm";
import { EquipmentFormValues } from "../../../types/equipmentSchema";

const EditEquipmentPage = () => {
  const { id } = useParams(); // Get dynamic route parameter
  const [equipment, setEquipment] = useState<EquipmentFormValues | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEquipment = async () => {
        try {
          const response = await fetch(`http://localhost:3001/equipment/${id}`);
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setEquipment(data);
          } else {
            setError("Failed to fetch equipment data");
          }
        } catch {
          setError("Failed to fetch equipment data");
        } finally {
          setLoading(false);
        }
      };

      fetchEquipment();
    }
  }, [id]);

  const handleUpdate = async (data: EquipmentFormValues) => {
    try {
      const BACKEND_URL =
        process.env.BACKEND_URL || "https://maintenance-fake-data.vercel.app";
      const response = await fetch(`${BACKEND_URL}/equipment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update equipment data");
      }

      // Redirect after successful update (you can also handle this in a more sophisticated way)
      alert("Equipment updated successfully");
      window.location.href = "/equipment";
    } catch {
      alert("Failed to update equipment data");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Equipment Update Form
        </h1>
        <EquipmentForm existingEquipment={equipment} onSubmit={handleUpdate} />
      </div>
    </div>
  );
};

export default EditEquipmentPage;
