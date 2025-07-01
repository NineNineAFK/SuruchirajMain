// src/api/searchProducts.ts
import axios from 'axios';

export const searchProducts = async (query: string) => {
  const response = await axios.get(`${import.meta.env.VITE_domainName}/api/products/search`, {
    params: { q: query },
  });
  return response.data;
};
