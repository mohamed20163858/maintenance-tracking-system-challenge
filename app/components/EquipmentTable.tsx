"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Equipment } from "../types/equipment"; // Assuming Equipment type is defined here

const EquipmentTable: React.FC<{ data: Equipment[] }> = ({ data }) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<
    "Operational" | "Down" | "Maintenance" | "Retired"
  >("Operational");

  // Column helper for creating columns
  const columnHelper = createColumnHelper<Equipment>();

  // Define columns for the table
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
      }),
      columnHelper.accessor("location", {
        header: "Location",
      }),
      columnHelper.accessor("department", {
        header: "Department",
      }),
      columnHelper.accessor("model", {
        header: "Model",
      }),
      columnHelper.accessor("serialNumber", {
        header: "Serial Number",
      }),
      columnHelper.accessor("installDate", {
        header: "Install Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span className={`status ${info.getValue().toLowerCase()}`}>
            {info.getValue()}
          </span>
        ),
      }),
    ],
    [columnHelper]
  );

  // Initialize the table with createTable and useReactTable
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Function to toggle row selection
  const toggleRowSelection = (rowId: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowId)) {
      newSelectedRows.delete(rowId);
    } else {
      newSelectedRows.add(rowId);
    }
    setSelectedRows(newSelectedRows);
  };

  // Function to apply bulk status update
  const applyBulkStatusUpdate = () => {
    console.log("Bulk updating selected rows to:", bulkStatus);
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <button
          onClick={applyBulkStatusUpdate}
          className="mr-2 p-2 bg-blue-500 text-white rounded"
        >
          Apply Bulk Status Update
        </button>
        <select
          value={bulkStatus}
          onChange={(e) =>
            setBulkStatus(
              e.target.value as
                | "Operational"
                | "Down"
                | "Maintenance"
                | "Retired"
            )
          }
          className="p-2 border rounded"
        >
          <option value="Operational">Operational</option>
          <option value="Down">Down</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border-b text-left"
                  //   {...column.getHeaderProps()}
                >
                  <div>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                  {/* <span>
                    {header.getIsSorted()
                      ? column.getIsSortedDesc()
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span> */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              //   {...row.getRowProps()}
              className={`${
                row.original.status === "Down"
                  ? "bg-red-100"
                  : row.original.status === "Maintenance"
                  ? "bg-yellow-100"
                  : row.original.status === "Retired"
                  ? "bg-gray-100"
                  : "bg-white"
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  //   {...cell.getCellProps()}
                  className="px-4 py-2 border-b"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
