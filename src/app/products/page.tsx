"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CircleX,
  Ellipsis,
  File,
  ListFilter,
  PlusCircle,
  Search,
} from "lucide-react";
import Image from "next/image";
import {
  ColumnFiltersState,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { SetStateAction, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Product, ProductStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/actions/products";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

const columnHelper = createColumnHelper<Product>();

const Homepage = () => {
  const products = useQuery({
    queryKey: ["products"],
    queryFn: async () => getProducts(),
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("images", {
        header: () => <span></span>,
        cell: (info) => (
          <Image
            src={"/placeholder.svg"}
            alt={info.row.original.name}
            width={60}
            height={60}
            className="aspect-square rounded-sm object-cover"
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("name", {
        header: (info) => <span className="flex justify-between">Name</span>,
        cell: (info) => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.accessor("status", {
        header: () => <span>Status</span>,
        cell: (info) => (
          <Badge
            className="capitalize"
            variant={
              info.getValue() === ProductStatus.ACTIVE
                ? "default"
                : info.getValue() === ProductStatus.DRAFT
                  ? "outline"
                  : "secondary"
            }
          >
            {info.getValue().toLowerCase()}
          </Badge>
        ),
      }),
      columnHelper.accessor("priceCents", {
        header: () => <span>Price</span>,
        cell: (info) => <span>${(info.getValue() / 100).toFixed(2)}</span>,
      }),
      columnHelper.accessor("stock", {
        header: () => <span>Stock</span>,
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("categoryName", {
        header: () => <span>Category</span>,
        cell: (info) => <span>{info.getValue()}</span>,
        meta: {
          filterVariant: "select",
        },
      }),
      columnHelper.accessor("description", {
        header: () => <span>Description</span>,
        cell: (info) => <span>{info.getValue().slice(0, 34)}...</span>,
        enableGlobalFilter: false,
        enableSorting: false,
      }),
      columnHelper.accessor("sku", {
        header: () => <span>SKU</span>,
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span></span>,
        cell: () => <Ellipsis className="size-4" />,
      }),
    ];
  }, [products.data]);

  const table = useReactTable({
    columns,
    data: products.data || [],
    state: {
      globalFilter,
      columnVisibility,
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      fuzzy: (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);

        addMeta({ itemRank });

        return itemRank.passed;
      },
    },
    globalFilterFn: "fuzzy",
  });

  const maxPage = 5;
  const pageBlock = Math.floor(pagination.pageIndex / maxPage);
  const startPage = pageBlock * maxPage;
  const pageBlockEnd = Math.min(startPage + maxPage, table.getPageCount());
  const pages = Array.from(
    { length: pageBlockEnd - startPage },
    (_, index) => startPage + index,
  );
  const getCanPreviousBlock = pageBlock > 0;
  const getCanNextBlock = pageBlockEnd < table.getPageCount();

  return (
    <div className="min-h-screen gap-2 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="max-w-md flex-1">
          <div className="relative flex items-center">
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-12"
              placeholder="Search"
            />
            <div className="absolute left-0 h-full border-r px-3">
              <Search className="size-4 h-full text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <ListFilter className="size-4" />
                  <span>Filter Product</span>
                </Button>
              </DropdownMenuTrigger>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  table.resetColumnFilters();
                  setSelectedStatus(() => "");
                }}
                className={cn(
                  !!selectedStatus ? "inline-flex gap-2" : "hidden",
                )}
              >
                <span>Clear filters</span>
                <CircleX className="size-4" />
              </Button>
              <DropdownMenuContent>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      className="uppercase"
                      checked={column.getIsVisible()}
                      key={column.id}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.split(/(?=[A-Z])/).join(" ")}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size={"sm"} className="gap-2">
              <File className="size-4" />
              <span>Export</span>
            </Button>
            <Button size={"sm"} className="gap-2">
              <PlusCircle className="size-4" />
              <span>Add Product</span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const { filterVariant } =
                          header.column.columnDef.meta ?? {};

                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder ? null : (
                              <div
                                className={cn(
                                  header.column.getCanSort()
                                    ? "flex cursor-pointer items-center justify-between"
                                    : "",
                                )}
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                {header.column.getIsSorted() === "asc" ? (
                                  <ArrowDown className="size-4" />
                                ) : header.column.getIsSorted() === "desc" ? (
                                  <ArrowUp className="size-4" />
                                ) : null}
                              </div>
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center text-muted-foreground"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <p className="w-full text-xs text-muted-foreground">
                Showing{" "}
                <strong>
                  {!!table.getRowCount()
                    ? pagination.pageIndex * pagination.pageSize + 1
                    : 0}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(
                    (pagination.pageIndex + 1) * pagination.pageSize,
                    table.getRowCount(),
                  )}{" "}
                </strong>
                of <strong>{table.getCoreRowModel().rows.length}</strong>{" "}
                {table.getCoreRowModel().rows.length <= 1
                  ? "product."
                  : "products."}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      disabled={!table.getCanPreviousPage()}
                      onClick={() => table.firstPage()}
                    >
                      <PaginationLink>
                        <DoubleArrowLeftIcon />
                      </PaginationLink>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      disabled={!table.getCanPreviousPage()}
                      onClick={(e) => {
                        e.preventDefault();
                        table.previousPage();
                      }}
                      variant="ghost"
                    >
                      <PaginationPrevious />
                    </Button>
                  </PaginationItem>

                  {getCanPreviousBlock && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {pages.map((pageIndex) => (
                    <PaginationItem key={pageIndex}>
                      <PaginationLink
                        isActive={pageIndex === pagination.pageIndex}
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(pageIndex);
                        }}
                      >
                        {pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {getCanNextBlock && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <Button
                      disabled={!table.getCanNextPage()}
                      onClick={(e) => {
                        e.preventDefault();
                        table.nextPage();
                      }}
                      variant="ghost"
                    >
                      <PaginationNext />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      disabled={!table.getCanNextPage()}
                      onClick={() => table.lastPage()}
                    >
                      <PaginationLink>
                        <DoubleArrowRightIcon />
                      </PaginationLink>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(e) => table.setPageSize(parseFloat(e))}
              >
                <SelectTrigger className="max-w-32">
                  <SelectValue placeholder="Row size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Row size</SelectLabel>
                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((number) => (
                      <SelectItem value={number.toString()}>
                        {number}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Homepage;
