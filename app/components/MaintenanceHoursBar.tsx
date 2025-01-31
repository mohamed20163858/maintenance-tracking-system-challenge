"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import { MaintenanceRecord } from "../types/maintenance";
import { Equipment } from "../types/equipment";

interface MaintenanceDepartmentHours {
  department: "Machining" | "Assembly" | "Packaging" | "Shipping";
  totalHours: number;
}

const MaintenanceHoursBar: React.FC = () => {
  const [totalData, setTotalData] = useState<MaintenanceDepartmentHours[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const BACKEND_URL =
          process.env.BACKEND_URL || "https://maintenance-fake-data.vercel.app";
        const [equipmentResponse, maintenanceResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/equipment`),
          fetch(`${BACKEND_URL}/maintenance`),
        ]);

        if (!equipmentResponse.ok || !maintenanceResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const equipmentData: Equipment[] = await equipmentResponse.json();
        const maintenanceData: MaintenanceRecord[] =
          await maintenanceResponse.json();

        // Aggregate data into a new array
        const departmentHours: MaintenanceDepartmentHours[] = [
          { department: "Machining", totalHours: 0 },
          { department: "Assembly", totalHours: 0 },
          { department: "Packaging", totalHours: 0 },
          { department: "Shipping", totalHours: 0 },
        ];

        maintenanceData.forEach((maintenance) => {
          const equipment = equipmentData.find(
            (eq) => eq.id === maintenance.equipmentId
          );
          if (equipment) {
            const department = departmentHours.find(
              (dept) => dept.department === equipment.department
            );
            if (department) {
              department.totalHours += maintenance.hoursSpent;
            }
          }
        });

        setTotalData(departmentHours);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) {
    return <p>Loading equipment data...</p>;
  }
  if (error) {
    return (
      <div>
        <p className="text-red-500">Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <BarChart
      width={500}
      height={300}
      data={totalData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="department" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="totalHours" fill="#8884d8" />
    </BarChart>
  );
};

export default MaintenanceHoursBar;
