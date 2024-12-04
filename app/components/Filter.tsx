import DebouncedInput from "./DebouncedInput";
import { Column } from "@tanstack/react-table";
import { Equipment } from "../types/equipment"; // Assuming Equipment type is defined here
export default function Filter({
  column,
}: {
  column: Column<Equipment, unknown>;
}) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div>
      <div className="flex items-center space-x-2">
        {/* See faceted column filters example for startDate endDate values functionality */}
        <label htmlFor="equipment-start-date" className="text-[14px]">
          Start Date:-{" "}
        </label>
        <DebouncedInput
          type="date"
          id="equipment-start-date"
          value={(columnFilterValue as [string, string])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [string, string]) => [value, old?.[1]])
          }
          placeholder={`Start Date`}
          className="w-24 border shadow rounded"
        />
        <label htmlFor="equipment-end-date" className="text-[14px]">
          End Date:-{" "}
        </label>
        <DebouncedInput
          type="date"
          id="equipment-end-date"
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
  ) : filterVariant === "statusSelect" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      id="statusSelect"
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="Operational">Operational</option>
      <option value="Maintenance">Maintenance</option>
      <option value="Down">Down</option>
      <option value="Retired">Retired</option>
    </select>
  ) : filterVariant === "departmentSelect" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      id="departmentSelect"
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="Machining">Machining</option>
      <option value="Assembly">Assembly</option>
      <option value="Packaging">Packaging</option>
      <option value="Shipping">Shipping</option>
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
