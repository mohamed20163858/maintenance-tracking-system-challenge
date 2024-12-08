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
  RowData,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Equipment } from "../types/equipment"; // Assuming Equipment type is defined here
import Filter from "./Filter";
import Pagination from "./Pagination";
import Link from "next/link";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  /* eslint-disable @typescript-eslint/no-unused-vars */
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?:
      | "text"
      | "range"
      | "statusSelect"
      | "departmentSelect"
      | "view";
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
const EquipmentTable: React.FC<{ data: Equipment[] }> = ({ data }) => {
  const [bulkStatus] = useState<
    "All" | "Operational" | "Down" | "Maintenance" | "Retired"
  >("All");
  const [sorting, setSorting] = useState<SortingState>([]);
  //   const rerender = useReducer(() => ({}), {})[1]

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
        cell: (info) => (
          <span className={`status ${info.getValue().toLowerCase()}`}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("id", {
        header: "View",
        meta: {
          filterVariant: "view",
        },
        cell: (info) => (
          <a
            href={`/equipment/${info.getValue()}`}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </a>
        ),
        enableSorting: false,
        // enableColumnFilter: false,
      }),
    ],
    [columnHelper]
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
  const applyBulkStatusUpdate = () => {
    console.log("Bulk updating selected rows to:", bulkStatus);
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
                      <Filter column={header.column} />
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
