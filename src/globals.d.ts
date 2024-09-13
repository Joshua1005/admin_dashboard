import { FilterFn, RowData } from "@tanstack/react-table";
import { PrismaClient } from "@prisma/client";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

declare global {
  var prismaGlobal: PrismaClient | undefined | null;
}
