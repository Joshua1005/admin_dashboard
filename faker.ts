import { faker } from "@faker-js/faker";
import { Product } from "@prisma/client";

interface RandomProduct extends Omit<Product, "id"> {
  id?: number;
}

const categories = ["Auto Parts", "Electronics", "Fashions", "Furnitures"];
const status = ["ACTIVE", "DRAFT", "ARCHIVE"] as const;

const createRandomProduct = (): RandomProduct => {
  let stock = faker.number.int({ min: 0, max: 1000 });

  return {
    sku: faker.commerce.isbn(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    priceCents: parseFloat(faker.commerce.price({ min: 1000, max: 9999 })),
    categoryName: categories[Math.floor(Math.random() * categories.length)],
    stock,
    onStock: stock > 0,
    images: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () =>
      faker.image.url(),
    ),
    status: status[Math.floor(Math.random() * status.length)],
    keywords: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () =>
      faker.commerce.productAdjective(),
    ),
  };
};

export { createRandomProduct };
