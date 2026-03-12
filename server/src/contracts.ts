export type UserRole = 'admin' | 'operator' | 'marketing';
export type ProductStatus = 'on_sale' | 'draft' | 'sold_out';
export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'completed' | 'refund';
export type CampaignStatus = 'upcoming' | 'running' | 'ended';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface UserInfo {
  id: string;
  name: string;
  role?: UserRole;
  avatar?: string;
  department?: string;
  displayName?: string;
}

export interface StoredUser {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  token: string;
  userInfo: UserInfo;
  role: UserRole;
}

export interface PageResult<T> {
  list: T[];
  total: number;
}

export interface DashboardMetrics {
  gmv: number;
  orders: number;
  conversionRate: number;
  newUsers: number;
  refundRate: number;
}

export interface TrendPoint {
  date: string;
  gmv: number;
  orders: number;
}

export interface HotProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface DashboardSummary {
  metrics: DashboardMetrics;
  trend: TrendPoint[];
  hotProducts: HotProduct[];
  campaignSummary: {
    activeCount: number;
    conversionRate: number;
    spend: number;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: ProductStatus;
  updatedAt: string;
}

export interface ProductFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: ProductStatus | '';
  category?: string;
}

export interface OrderLineItem {
  name: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderNo: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  channel: string;
  address: string;
  createdAt: string;
  items: OrderLineItem[];
}

export interface OrderFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: OrderStatus | '';
  channel?: string;
}

export interface CampaignItem {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spend: number;
  conversionRate: number;
  startAt: string;
  endAt: string;
  owner: string;
}

export interface CampaignFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: CampaignStatus | '';
}

export interface AuthTokenPayload {
  sub: string;
  username: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  avatar?: string;
}
