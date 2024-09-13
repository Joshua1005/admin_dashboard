"use client";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useCategory } from "@/hooks/products/use-category";

type Variant = {
  sku: string;
  stock: number;
  priceCents: number;
};

const variants: Variant[] = [
  { sku: "GGPC-001", stock: 100, priceCents: 9999 },
  { sku: "GGPC-002", stock: 143, priceCents: 9999 },
  { sku: "GGPC-003", stock: 32, priceCents: 9999 },
];

const columnHelpers = createColumnHelper<Variant>();

const Homepage = () => {
  const [data, setData] = useState<Variant[]>(() => [...variants]);
  const inputFileUploadRef = useRef<HTMLInputElement>(null);
  const categories = useCategory();

  const columns = useMemo(
    () => [
      columnHelpers.accessor("sku", {
        header: () => <span>SKU</span>,
        cell: (info) => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
      }),
      columnHelpers.accessor("stock", {
        header: () => <span>Stock</span>,
        cell: (info) => (
          <Input
            type="number"
            value={info.getValue()}
            onChange={(e) =>
              setData((data) =>
                data.map((data) =>
                  data.sku === info.row.original.sku
                    ? { ...data, stock: parseFloat(e.target.value) }
                    : data,
                ),
              )
            }
          />
        ),
      }),
      columnHelpers.accessor("priceCents", {
        header: () => <span>Price</span>,
        cell: (info) => (
          <Input
            type="number"
            value={info.getValue() / 100}
            onChange={(e) =>
              setData((data) =>
                data.map((data) =>
                  data.sku === info.row.original.sku
                    ? { ...data, priceCents: parseFloat(e.target.value) * 100 }
                    : data,
                ),
              )
            }
          />
        ),
      }),
    ],
    [data],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);

        addMeta({ itemRank });

        return itemRank.passed;
      },
    },
  });

  return (
    <div className="grid min-h-screen max-w-screen-lg grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Lipsum dolor sit amet, consectetur adipiscing elit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Name</Label>
              <Input placeholder="Game Gear Pro Controller" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Game Gear Pro Controller" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stock</CardTitle>
            <CardDescription>
              Lipsum dolor sit amet, consectetur adipiscing elit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableHeader key={headerGroup.id}>
                  <TableRow>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              ))}
              <TableBody>
                {table.getCoreRowModel().rows.map((row) => (
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <Separator className="mb-6" />
          <CardFooter className="justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <PlusCircle className="size-4" />
                  <span>Add Variant</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle />
                  <DialogDescription />
                </DialogHeader>
                <form className="grid gap-2">
                  <div>
                    <Label>SKU</Label>
                    <Input />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Stock</Label>
                      <Input type="number" />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input type="number" />
                    </div>
                  </div>
                  <Button className="w-full" type="submit">
                    Continue
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectSeparator />

                      {categories.data?.map((category) => (
                        <SelectItem value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Lipsum dolor sit amet, consectetur adipiscing elit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div>
                <Image
                  src="/placeholder.svg"
                  width={300}
                  height={300}
                  alt=""
                  className="rounded-md object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Image
                  src="/placeholder.svg"
                  width={84}
                  height={84}
                  alt=""
                  className="rounded-md object-cover"
                />
                <Image
                  src="/placeholder.svg"
                  width={84}
                  height={84}
                  alt=""
                  className="aspect-square rounded-md object-cover"
                />
                <Button
                  onClick={() => {
                    if (!inputFileUploadRef.current) return;

                    inputFileUploadRef.current.click();
                  }}
                  variant="ghost"
                  className="flex aspect-square size-full items-center justify-center rounded-md border border-dashed"
                >
                  <Upload className="size-4" />
                  <Input
                    ref={inputFileUploadRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    multiple
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>Archive Product</CardTitle>
            <CardDescription>
              Lipsum dolor sit amet, consectetur adipiscing elit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary">Archive Product</Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Homepage;
