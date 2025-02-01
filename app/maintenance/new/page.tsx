"use client";

import React from "react";
import { MaintenanceRecordFormValues } from "../../types/maintenanceSchema";
import MaintenanceForm from "../../components/MaintenanceRecordForm";

const MaintenanceFormPage = () => {
  const handleCreate = async (data: MaintenanceRecordFormValues) => {
    // console.log("Form submitted with data:", data); // Log the form data

    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://maintenance-fake-data.vercel.app";
      const response = await fetch(`${BACKEND_URL}/maintenance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create new maintenance record");
      }

      // Redirect or notify user of success
      alert("Record created successfully");
      window.location.href = "/maintenance";
    } catch {
      //   console.error("Error during form submission:", error); // Log errors
      alert("Failed to create new maintenance record");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Maintenance Record Form
        </h1>
        <MaintenanceForm onSubmit={handleCreate} />
      </div>
    </div>
  );
};

export default MaintenanceFormPage;
