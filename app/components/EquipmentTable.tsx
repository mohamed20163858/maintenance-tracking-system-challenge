"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  SortingFn,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Equipment } from "../types/equipment"; // Assuming Equipment type is defined here
import EquipmentFilter from "./EquipmentFilter";
import Pagination from "./Pagination";
import Link from "next/link";

const EquipmentTable: React.FC<{ data: Equipment[] }> = ({ data }) => {
  // const [bulkStatus] = useState<
  //   "All" | "Operational" | "Down" | "Maintenance" | "Retired"
  // >("All");
  const [sorting, setSorting] = useState<SortingState>([]);
  //   const rerender = useReducer(() => ({}), {})[1]

  const [statusChanges, setStatusChanges] = useState<Record<string, string>>(
    {}
  );
  // Column helper for creating columns
  const columnHelper = createColumnHelper<Equipment>();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  //custom sorting logic for one of our enum columns
  const sortStatusFn: SortingFn<Equipment> = (rowA, rowB) => {
    const statusA = rowA.original.status;
    const statusB = rowB.original.status;
    const statusOrder = ["Operational", "Maintenance", "Down", "Retired"];
    return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
  };

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
        meta: {
          filterVariant: "departmentSelect",
        },
      }),
      columnHelper.accessor("model", {
        header: "Model",
      }),
      columnHelper.accessor("serialNumber", {
        header: "Serial Number",
      }),
      columnHelper.accessor("installDate", {
        header: "Install Date",
        meta: {
          filterVariant: "range",
        },
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        filterFn: (row, columnId, filterValue) => {
          const value: string = row.getValue(columnId);
          const [start, end] = filterValue as [string, string];
          if (start && value < start) return false;
          if (end && value > end) return false;
          return true;
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        sortingFn: sortStatusFn, //use our custom sorting function for this enum column
        meta: {
          filterVariant: "statusSelect",
        },
        cell: (info) => {
          const id = info.row.original.id; // Unique row identifier
          const currentStatus = statusChanges[id] ?? info.getValue();
          return (
            <select
              value={currentStatus}
              onChange={(e) =>
                setStatusChanges((prev) => ({
                  ...prev,
                  [id]: e.target.value,
                }))
              }
              className="border rounded px-2 py-1"
            >
              <option value="Operational">Operational</option>
              <option value="Down">Down</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          );
        },
      }),
      columnHelper.accessor("id", {
        header: "View",
        meta: {
          filterVariant: "view",
        },
        cell: (info) => (
          <Link
            href={`/equipment/${info.getValue()}`}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </Link>
        ),
        enableSorting: false,
        // enableColumnFilter: false,
      }),
    ],
    [columnHelper, statusChanges]
  );

  // Initialize the table with createTable and useReactTable
  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });
  // Function to apply bulk status update
  // const applyBulkStatusUpdate = () => {
  //   console.log("Bulk updating selected rows to:", bulkStatus);
  // };
  const applyBulkStatusUpdate = async () => {
    try {
      const updatePromises = Object.entries(statusChanges).map(([id, status]) =>
        fetch(`http://localhost:3001/equipment/${id}`, {
          method: "PATCH", // or PUT
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        })
      );

      await Promise.all(updatePromises);

      alert("Statuses updated successfully!");
      window.location.href = "/equipment";

      setStatusChanges({}); // Clear local changes after successful update
    } catch (error) {
      console.error(error);
      alert("Failed to update statuses. Please try again.");
    }
  };

  return (
    <div>
      <table className="min-w-full border-collapse mb-5">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border-b text-left"
                  //   {...column.getHeaderProps()}
                >
                  <div
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === "asc"
                          ? "Sort ascending"
                          : header.column.getNextSortingOrder() === "desc"
                          ? "Sort descending"
                          : "Clear sort"
                        : undefined
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                  {header.column.getCanFilter() ? (
                    <div>
                      <EquipmentFilter column={header.column} />
                    </div>
                  ) : null}
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
      <Pagination table={table} />
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={applyBulkStatusUpdate}
          className="mr-2 p-2 bg-blue-500 text-white rounded"
        >
          Apply Bulk Status Update
        </button>
        <Link
          href="/equipment/new"
          className="ml-2 p-2 bg-green-500 text-white rounded"
        >
          Add New Equipment
        </Link>
      </div>
    </div>
  );
};

export default EquipmentTable;
