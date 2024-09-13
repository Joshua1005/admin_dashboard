"use client";

import { getCategories } from "@/actions/products";
import { useQuery } from "@tanstack/react-query";

const useCategory = () => {
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategories(),
  });

  return categories;
};

export { useCategory };
