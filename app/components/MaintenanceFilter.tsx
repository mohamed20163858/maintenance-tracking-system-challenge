import DebouncedInput from "./DebouncedInput";
import { Column } from "@tanstack/react-table";
import { MaintenanceRecord } from "../types/maintenance";
export default function MaintenanceFilter({
  column,
}: {
  column: Column<MaintenanceRecord, unknown>;
}) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div>
      <div className="flex items-center space-x-2">
        {/* See faceted column filters example for startDate endDate values functionality */}
        <label htmlFor="maintenance-start-date" className="text-[14px]">
          Start Date:-{" "}
        </label>
        <DebouncedInput
          type="date"
          id="maintenance-start-date"
          value={(columnFilterValue as [string, string])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [string, string]) => [value, old?.[1]])
          }
          placeholder={`Start Date`}
          className="w-24 border shadow rounded"
        />
        <label htmlFor="maintenance-end-date" className="text-[14px]">
          End Date:-{" "}
        </label>
        <DebouncedInput
          type="date"
          id="maintenance-end-date"
          value={(columnFilterValue as [string, string])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [string, string]) => [old?.[0], value])
          }
          placeholder={`End Date`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "numberRange" ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "typeSelect" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      id="typeSelect"
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="Preventive">Preventive</option>
      <option value="Repair">Repair</option>
      <option value="Emergency">Emergency</option>
    </select>
  ) : filterVariant === "prioritySelect" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      id="departmentSelect"
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
  ) : filterVariant === "completionStatusSelect" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      id="completionStatusSelect"
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="Complete">Complete</option>
      <option value="Incomplete">Incomplete</option>
      <option value="Pending Parts">Pending Parts</option>
    </select>
  ) : filterVariant === "view" ? (
    <br></br>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
      name="textSearch"
    />
    // See faceted column filters example for datalist search suggestions
  );
}
