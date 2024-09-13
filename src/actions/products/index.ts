"use server";

import db from "@/lib/db";

async function getProducts() {
  try {
    const products = await db.product.findMany({});

    return products;
  } catch (error) {
    throw error;
  }
}

async function getCategories() {
  try {
    const categories = await db.category.findMany({ orderBy: { name: "asc" } });

    return categories;
  } catch (error) {
    throw error;
  }
}

export { getProducts, getCategories };
