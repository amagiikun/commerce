import type { PageResult, ProductFilter, ProductItem } from '@/types';
import request from '@/utils/request';

export function fetchProducts(params: ProductFilter) {
  return request.get<never, PageResult<ProductItem>>('/products', { params });
}

export const getProductList = fetchProducts;

export function updateProduct(productId: string, payload: Partial<ProductItem>) {
  return request.patch<never, ProductItem>(`/products/${productId}`, payload);
}
