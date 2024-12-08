"use client";

import React from "react";
import { EquipmentFormValues } from "../../types/equipmentSchema";
import EquipmentForm from "../../components/EquipmentForm";

const EquipmentFormPage = () => {
  const handleCreate = async (data: EquipmentFormValues) => {
    try {
      const response = await fetch("http://localhost:3001/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create new equipment");
      }

      // Redirect or notify user of success
      window.location.href = "/equipment";
    } catch {
      alert("Failed to create new equipment");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Equipment Creation Form
        </h1>
        <EquipmentForm onSubmit={handleCreate} />
      </div>
    </div>
  );
};

export default EquipmentFormPage;
