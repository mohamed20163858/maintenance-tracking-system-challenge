import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // Allows us to define custom properties for our columns
  /* eslint-disable @typescript-eslint/no-unused-vars */
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?:
      | "text"
      | "range"
      | "statusSelect"
      | "departmentSelect"
      | "typeSelect"
      | "numberRange"
      | "completionStatusSelect"
      | "prioritySelect"
      | "view";
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
