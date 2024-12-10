"use client";

import { useState, useMemo, Fragment } from "react";
import {
  useReactTable,
  GroupingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  createColumnHelper,
  SortingFn,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { MaintenanceRecord } from "../types/maintenance";
import MaintenanceFilter from "./MaintenanceFilter";
import Pagination from "./Pagination";
import Link from "next/link";

const MaintenanceTable: React.FC<{
  data: MaintenanceRecord[];
  equipmentMap: Record<string, string>;
}> = ({ data, equipmentMap }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnHelper = createColumnHelper<MaintenanceRecord>();
  const [grouping, setGrouping] = useState<GroupingState>(["equipmentId"]);

  const sortPriorityFn: SortingFn<MaintenanceRecord> = (rowA, rowB) => {
    const priorityA = rowA.original.priority;
    const priorityB = rowB.original.priority;
    const priorityOrder = ["Low", "Medium", "High"];
    return priorityOrder.indexOf(priorityA) - priorityOrder.indexOf(priorityB);
  };

  const sortTypeFn: SortingFn<MaintenanceRecord> = (rowA, rowB) => {
    const typeA = rowA.original.type;
    const typeB = rowB.original.type;
    const typeOrder = ["Preventive", "Repair", "Emergency"];
    return typeOrder.indexOf(typeA) - typeOrder.indexOf(typeB);
  };

  const sortCompletionStatusFn: SortingFn<MaintenanceRecord> = (rowA, rowB) => {
    const completionStatusA = rowA.original.completionStatus;
    const completionStatusB = rowB.original.completionStatus;
    const completionStatusOrder = ["Complete", "Incomplete", "Pending Parts"];
    return (
      completionStatusOrder.indexOf(completionStatusA) -
      completionStatusOrder.indexOf(completionStatusB)
    );
  };
  const columns = useMemo(
    () => [
      columnHelper.accessor("equipmentId", {
        header: "Equipment Name",
        cell: (info) => equipmentMap[info.getValue()] || "Unknown",
        enableGrouping: true, // Allow grouping by this column
        filterFn: (row, columnId, filterValue) => {
          const equipmentId = row.getValue(columnId) as string; // Cast to string
          const equipmentName = equipmentMap[equipmentId];
          if (!equipmentName) return false;
          return equipmentName
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        },
      }),
      columnHelper.accessor("date", {
        header: "Date",
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
      columnHelper.accessor("type", {
        header: "Type",
        sortingFn: sortTypeFn,
        meta: {
          filterVariant: "typeSelect",
        },
      }),
      columnHelper.accessor("technician", {
        header: "Technician",
      }),
      columnHelper.accessor("hoursSpent", {
        header: "Hours Spent",
        meta: {
          filterVariant: "numberRange",
        },
      }),
      //   columnHelper.accessor("description", {
      //     header: "Description",
      //   }),
      columnHelper.accessor("priority", {
        header: "Priority",
        sortingFn: sortPriorityFn,
        meta: {
          filterVariant: "prioritySelect",
        },
      }),
      columnHelper.accessor("completionStatus", {
        header: "Completion Status",
        sortingFn: sortCompletionStatusFn,
        meta: {
          filterVariant: "completionStatusSelect",
        },
      }),
      columnHelper.accessor("id", {
        header: "View",
        meta: {
          filterVariant: "view",
        },
        cell: (info) => (
          <a
            href={`/maintenance/${info.getValue()}`}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </a>
        ),
        enableSorting: false,
      }),
    ],
    [equipmentMap, columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      sorting,
      columnFilters,
      grouping,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getGroupedRowModel: getGroupedRowModel(),
    onGroupingChange: setGrouping,
  });

  return (
    <div>
      <table className="min-w-full border-collapse mb-5">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // Check if the column is the "equipmentId" column
                const isEquipmentColumn = header.id === "equipmentId";

                // Only render the Equipment Name header if grouping is not applied
                if (isEquipmentColumn && grouping.length > 0) {
                  return null; // Skip rendering if it's the equipment column and grouping is applied
                }
                return (
                  <th key={header.id} className="px-4 py-2 border-b text-left">
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
                    {header.column.getCanFilter() && (
                      <MaintenanceFilter column={header.column} />
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        {/* <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody> */}
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              {/* Only Render Group Header for Group Rows */}
              {row.subRows?.length > 0 && (
                <tr
                  className={`bg-gray-200 font-bold py-2 px-4
                  `}
                >
                  <td colSpan={columns.length}>
                    {equipmentMap[row.id.split(":")[1]] || "Unknown Equipment"}
                  </td>
                </tr>
              )}

              {/* Render Rows in the Group or Single Row */}
              {(row.subRows?.length > 0 ? row.subRows : [row]).map((subRow) => (
                <tr key={subRow.id}>
                  {subRow.getVisibleCells().map((cell) => {
                    // Check if the column is the "equipmentId" column
                    const isEquipmentColumn = cell.column.id === "equipmentId";

                    // Skip rendering the cell for "Equipment Name" if grouping is applied
                    if (isEquipmentColumn && grouping.length > 0) {
                      return null;
                    }
                    return (
                      <td key={cell.id} className="px-4 py-2 border-b">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
      <Pagination table={table} />
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() =>
            setGrouping(
              (prev) => (prev.length ? [] : ["equipmentId"]) // Toggle grouping
            )
          }
          className=" p-2 bg-blue-500 text-white rounded"
        >
          Toggle Grouping by Equipment
        </button>
        <Link
          href="/maintenance/new"
          className="ml-2 p-2 bg-green-500 text-white rounded"
        >
          Add New Maintenance Record
        </Link>
      </div>
    </div>
  );
};

export default MaintenanceTable;
