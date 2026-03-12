import { PrismaClient } from '@prisma/client';
import type {
  CampaignFilter,
  CampaignItem,
  OrderFilter,
  OrderItem,
  OrderLineItem,
  ProductFilter,
  ProductItem,
  StoredUser,
  UserRole,
} from '../contracts.js';
import type { AppRepository } from './repository.js';
import { roleLabelMap } from '../fixtures/demo-data.js';
import { prisma } from '../lib/prisma.js';
import { formatDate, formatDateTime } from '../utils/date.js';
import { parsePositiveInteger } from '../utils/pagination.js';

function normalizeText(value: unknown) {
  return String(value ?? '').trim();
}

function isPrismaNotFoundError(error: unknown) {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && (error as { code?: unknown }).code === 'P2025';
}

function mapStoredUser(user: {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  avatar: string | null;
}): StoredUser {
  return {
    id: user.id,
    username: user.username,
    passwordHash: user.passwordHash,
    name: user.name,
    role: user.role,
    avatar: user.avatar ?? undefined,
  };
}

function mapProduct(product: {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: ProductItem['status'];
  updatedAt: Date;
}): ProductItem {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    stock: product.stock,
    sales: product.sales,
    status: product.status,
    updatedAt: formatDateTime(product.updatedAt),
  };
}

function mapOrderLineItems(items: Array<{ productName: string; quantity: number }>): OrderLineItem[] {
  return items.map((item) => ({
    name: item.productName,
    quantity: item.quantity,
  }));
}

function mapOrder(order: {
  id: string;
  orderNo: string;
  customerName: string;
  amount: number;
  status: OrderItem['status'];
  channel: string;
  address: string;
  createdAt: Date;
  items: Array<{ productName: string; quantity: number }>;
}): OrderItem {
  return {
    id: order.id,
    orderNo: order.orderNo,
    customerName: order.customerName,
    amount: Number(order.amount),
    status: order.status,
    channel: order.channel,
    address: order.address,
    createdAt: formatDateTime(order.createdAt),
    items: mapOrderLineItems(order.items),
  };
}

function mapCampaign(campaign: {
  id: string;
  name: string;
  status: CampaignItem['status'];
  budget: number;
  spend: number;
  conversionRate: number;
  startAt: Date;
  endAt: Date;
  owner: string;
}): CampaignItem {
  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    budget: Number(campaign.budget),
    spend: Number(campaign.spend),
    conversionRate: Number(campaign.conversionRate),
    startAt: formatDate(campaign.startAt),
    endAt: formatDate(campaign.endAt),
    owner: campaign.owner,
  };
}

function pickProductUpdate(payload: Partial<ProductItem>) {
  const data: Record<string, unknown> = {};

  if (typeof payload.name === 'string') data.name = payload.name;
  if (typeof payload.category === 'string') data.category = payload.category;
  if (typeof payload.price === 'number') data.price = payload.price;
  if (typeof payload.stock === 'number') data.stock = payload.stock;
  if (typeof payload.sales === 'number') data.sales = payload.sales;
  if (typeof payload.status === 'string') data.status = payload.status;

  return data;
}

export class PrismaRepository implements AppRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findUserByUsername(username: string) {
    const target = await this.client.user.findUnique({
      where: { username },
    });

    return target ? mapStoredUser(target) : null;
  }

  getRoleLabel(role: UserRole) {
    return roleLabelMap[role];
  }

  async listProducts(filter: Partial<ProductFilter>) {
    const page = parsePositiveInteger(filter.page, 1);
    const pageSize = parsePositiveInteger(filter.pageSize, 10);
    const keyword = normalizeText(filter.keyword);
    const status = normalizeText(filter.status);
    const category = normalizeText(filter.category);

    const where = {
      ...(keyword ? { name: { contains: keyword } } : {}),
      ...(status ? { status: status as ProductItem['status'] } : {}),
      ...(category ? { category } : {}),
    };

    const [list, total] = await this.client.$transaction([
      this.client.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.client.product.count({ where }),
    ]);

    return {
      list: list.map(mapProduct),
      total,
    };
  }

  async updateProduct(productId: string, payload: Partial<ProductItem>) {
    try {
      const target = await this.client.product.update({
        where: { id: productId },
        data: pickProductUpdate(payload),
      });

      return mapProduct(target);
    } catch (error: unknown) {
      if (isPrismaNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  async listOrders(filter: Partial<OrderFilter>) {
    const page = parsePositiveInteger(filter.page, 1);
    const pageSize = parsePositiveInteger(filter.pageSize, 10);
    const keyword = normalizeText(filter.keyword);
    const status = normalizeText(filter.status);
    const channel = normalizeText(filter.channel);

    const where = {
      ...(keyword
        ? {
            OR: [
              { orderNo: { contains: keyword } },
              { customerName: { contains: keyword } },
            ],
          }
        : {}),
      ...(status ? { status: status as OrderItem['status'] } : {}),
      ...(channel ? { channel } : {}),
    };

    const [list, total] = await this.client.$transaction([
      this.client.order.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.client.order.count({ where }),
    ]);

    return {
      list: list.map(mapOrder),
      total,
    };
  }

  async getOrderById(orderId: string) {
    const target = await this.client.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    return target ? mapOrder(target) : null;
  }

  async listCampaigns(filter: Partial<CampaignFilter>) {
    const page = parsePositiveInteger(filter.page, 1);
    const pageSize = parsePositiveInteger(filter.pageSize, 10);
    const keyword = normalizeText(filter.keyword);
    const status = normalizeText(filter.status);

    const where = {
      ...(keyword ? { name: { contains: keyword } } : {}),
      ...(status ? { status: status as CampaignItem['status'] } : {}),
    };

    const [list, total] = await this.client.$transaction([
      this.client.campaign.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.client.campaign.count({ where }),
    ]);

    return {
      list: list.map(mapCampaign),
      total,
    };
  }

  async getCampaignById(campaignId: string) {
    const target = await this.client.campaign.findUnique({
      where: { id: campaignId },
    });

    return target ? mapCampaign(target) : null;
  }

  async listAllUsers() {
    const users = await this.client.user.findMany({ orderBy: { id: 'asc' } });
    return users.map(mapStoredUser);
  }

  async listAllProducts() {
    const products = await this.client.product.findMany({ orderBy: { id: 'asc' } });
    return products.map(mapProduct);
  }

  async listAllOrders() {
    const orders = await this.client.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(mapOrder);
  }

  async listAllCampaigns() {
    const campaigns = await this.client.campaign.findMany({ orderBy: { id: 'asc' } });
    return campaigns.map(mapCampaign);
  }
}

export function createPrismaRepository(client?: PrismaClient) {
  return new PrismaRepository(client ?? prisma);
}
