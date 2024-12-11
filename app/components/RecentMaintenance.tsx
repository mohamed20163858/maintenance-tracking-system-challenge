"use client";
import { useState, useEffect } from "react";
import { MaintenanceRecord } from "../types/maintenance";
import { Equipment } from "../types/equipment";
import Link from "next/link";

const RecentMaintenanceTable: React.FC = () => {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRecord[]>(
    []
  );
  const [equipmentData, setEquipmentData] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const [maintenanceRes, equipmentRes] = await Promise.all([
          fetch("http://localhost:3001/maintenance"),
          fetch("http://localhost:3001/equipment"),
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
        // Sort the records by date (descending order) and slice the first 10
        const sortedData = maintenanceRecords
          .sort((a: MaintenanceRecord, b: MaintenanceRecord) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
          .slice(0, 10);
        setMaintenanceData(sortedData);
        setEquipmentData(equipmentMap);
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {/* <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th> */}
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            Equipment
          </th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            Technician
          </th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hours</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Priority</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            completion status
          </th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>visit</th>
        </tr>
      </thead>
      <tbody>
        {maintenanceData.map((record) => (
          <tr key={record.id}>
            {/* <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {record.id}
            </td> */}
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {equipmentData[record.equipmentId]}{" "}
              {/* Display the equipment ID */}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {new Date(record.date).toISOString().split("T")[0]}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {record.type}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {record.technician}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {record.hoursSpent}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {record.priority}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {record.completionStatus}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              <Link
                href={`/maintenance/${record.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                visit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecentMaintenanceTable;
