"use server";

import db from "@/lib/db";

async function addProduct(data: Record<string, any>) {
  try {
  } catch (error) {
    throw error;
  }
}

async function getProducts() {
  try {
    const products = await db.product.findMany({});

    return products;
  } catch (error) {
    throw error;
  }
}

async function getProduct(id: number) {
  try {
    const product = await db.product.findUnique({ where: { id } });

    return product;
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

export { getProducts, getProduct, getCategories };
