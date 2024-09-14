import { getCategories } from "@/actions/products";
import { ProductStatus } from "@prisma/client";
import { z } from "zod";

const zodSchema = {
  product: z.object({
    name: z.string(),
    sky: z.string(),
    description: z.string(),
    priceCents: z.number(),
    categoryName: z.string().refine(async (value) => {
      const categories = await getCategories();

      return categories.includes({ name: value });
    }),
    stock: z.number(),
    status: z.enum([
      ProductStatus.ACTIVE,
      ProductStatus.ARCHIVE,
      ProductStatus.DRAFT,
    ]),
    images: z.array(z.string()),
    variants: z.object({
      sku: z.string(),
      name: z.string(),
      value: z.string(),
      stock: z.number(),
    }),
    keywords: z.array(z.string()),
  }),
};
