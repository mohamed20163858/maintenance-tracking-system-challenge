"use client";

import { useEffect, useState } from "react";
import EquipmentTable from "../components/EquipmentTable";
import { Equipment } from "../types/equipment";

const EquipmentPage = () => {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      const response = await fetch("http://localhost:3001/equipment");
      if (!response.ok) {
        throw new Error("Failed to fetch equipment data");
      }
      const data = await response.json();
      setEquipmentData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred");
      } else if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        setError(err.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
    const interval = setInterval(fetchEquipment, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) {
    return <p>Loading equipment data...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">Error: {error}</p>
        {equipmentData.length > 0 && (
          <div className="p-4">
            <p className="flex justify-center bg-red-100 text-red-500">
              these are outdated data due to unreachability to the server
            </p>
            <h1 className="text-xl font-bold mb-4">Equipment List</h1>
            <EquipmentTable data={equipmentData} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Equipment List</h1>
      <EquipmentTable data={equipmentData} />
    </div>
  );
};

export default EquipmentPage;
