"use client";

import { useEffect, useState } from "react";
import MaintenanceTable from "../components/MaintenanceRecordsTable";
import { MaintenanceRecord } from "../types/maintenance";
import { Equipment } from "../types/equipment";

const MaintenancePage = () => {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRecord[]>(
    []
  );
  const [equipmentData, setEquipmentData] = useState<Record<string, string>>(
    {}
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const BACKEND_URL =
        process.env.BACKEND_URL || "https://maintenance-fake-data.vercel.app";
      const [maintenanceRes, equipmentRes] = await Promise.all([
        fetch(`${BACKEND_URL}/maintenance`),
        fetch(`${BACKEND_URL}/equipment`),
      ]);
      if (!maintenanceRes.ok || !equipmentRes.ok) {
        throw new Error("Failed to fetch data");
      }
      const maintenanceRecords = await maintenanceRes.json();
      const equipmentRecords: Equipment[] = await equipmentRes.json();
      // Create a map of equipmentId to equipmentName
      const equipmentMap = equipmentRecords.reduce<Record<string, string>>(
        (acc, equipment) => {
          acc[equipment.id] = equipment.name;
          return acc;
        },
        {}
      );
      setMaintenanceData(maintenanceRecords);
      setEquipmentData(equipmentMap);
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
    fetchData();
    // Implement polling if necessary
    // const interval = setInterval(fetchMaintenanceRecords, 5000);

    // Cleanup on unmount
    // return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p>Loading maintenance data...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">Error: {error}</p>
        {maintenanceData.length > 0 && (
          <div className="p-4">
            <p className="flex justify-center bg-red-100 text-red-500">
              These are outdated data due to unreachability to the server
            </p>
            <h1 className="text-xl font-bold mb-4">Maintenance Records</h1>
            <MaintenanceTable
              data={maintenanceData}
              equipmentMap={equipmentData}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Maintenance Records</h1>
      <MaintenanceTable data={maintenanceData} equipmentMap={equipmentData} />
    </div>
  );
};

export default MaintenancePage;
