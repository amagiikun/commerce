import type {
  CampaignFilter,
  CampaignItem,
  OrderFilter,
  OrderItem,
  PageResult,
  ProductFilter,
  ProductItem,
  StoredUser,
  UserRole,
} from '../contracts.js';

export interface AppRepository {
  findUserByUsername(username: string): Promise<StoredUser | null>;
  getRoleLabel(role: UserRole): string;
  listProducts(filter: Partial<ProductFilter>): Promise<PageResult<ProductItem>>;
  updateProduct(productId: string, payload: Partial<ProductItem>): Promise<ProductItem | null>;
  listOrders(filter: Partial<OrderFilter>): Promise<PageResult<OrderItem>>;
  getOrderById(orderId: string): Promise<OrderItem | null>;
  listCampaigns(filter: Partial<CampaignFilter>): Promise<PageResult<CampaignItem>>;
  getCampaignById(campaignId: string): Promise<CampaignItem | null>;
  listAllUsers(): Promise<StoredUser[]>;
  listAllProducts(): Promise<ProductItem[]>;
  listAllOrders(): Promise<OrderItem[]>;
  listAllCampaigns(): Promise<CampaignItem[]>;
}
