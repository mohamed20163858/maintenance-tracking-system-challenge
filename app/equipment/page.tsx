"use client";

import { useEffect, useState } from "react";
import EquipmentTable from "../components/EquipmentTable";
import { Equipment } from "../types/equipment";

const EquipmentPage = () => {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("http://localhost:3001/equipment");
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        const data = await response.json();
        setEquipmentData(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  if (loading) {
    return <p>Loading equipment data...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Equipment List</h1>
      <EquipmentTable data={equipmentData} />
    </div>
  );
};

export default EquipmentPage;
