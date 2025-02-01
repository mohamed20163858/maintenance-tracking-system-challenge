"use client";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { Equipment } from "../types/equipment";

const COLORS = ["#4CAF50", "#FF5722", "#FFC107", "#9E9E9E"];

interface EquipmentStatus {
  name: "Operational" | "Down" | "Maintenance" | "Retired";
  value: number;
}

const initialData: EquipmentStatus[] = [
  { name: "Operational", value: 0 },
  { name: "Down", value: 0 },
  { name: "Maintenance", value: 0 },
  { name: "Retired", value: 0 },
];

const EquipmentStatusPie: React.FC = () => {
  const [equipmentData, setEquipmentData] =
    useState<EquipmentStatus[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const BACKEND_URL =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "https://maintenance-fake-data.vercel.app";
        const response = await fetch(`${BACKEND_URL}/equipment`);
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        const data: Equipment[] = await response.json();

        // Process the data locally
        const processedData = initialData.map((status) => ({
          ...status,
          value: data.filter((record) => record.status === status.name).length,
        }));
        setEquipmentData(processedData);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
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
    return (
      <div>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={equipmentData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {equipmentData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default EquipmentStatusPie;
