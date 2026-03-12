import type {
  CampaignFilter,
  OrderFilter,
  ProductFilter,
  ProductItem,
  UserRole,
} from '../contracts.js';
import type { AppRepository } from './repository.js';
import { createDemoState, type DemoState } from '../fixtures/demo-data.js';
import { formatDateTime } from '../utils/date.js';
import { paginateArray, parsePositiveInteger } from '../utils/pagination.js';

function normalizeText(value: unknown) {
  return String(value ?? '').trim();
}

function clone<T>(value: T) {
  return structuredClone(value);
}

function pickProductPatch(payload: Partial<ProductItem>) {
  const patch: Partial<ProductItem> = {};

  if (typeof payload.name === 'string') patch.name = payload.name;
  if (typeof payload.category === 'string') patch.category = payload.category;
  if (typeof payload.price === 'number') patch.price = payload.price;
  if (typeof payload.stock === 'number') patch.stock = payload.stock;
  if (typeof payload.sales === 'number') patch.sales = payload.sales;
  if (typeof payload.status === 'string') patch.status = payload.status;

  return patch;
}

export class InMemoryRepository implements AppRepository {
  private readonly state: DemoState;

  constructor(seedData: DemoState = createDemoState()) {
    this.state = clone(seedData);
  }

  async findUserByUsername(username: string) {
    const target = this.state.users.find((item) => item.username === username);
    return target ? clone(target) : null;
  }

  getRoleLabel(role: UserRole) {
    return this.state.roleLabelMap[role];
  }

  async listProducts(filter: Partial<ProductFilter>) {
    const page = parsePositiveInteger(filter.page, 1);
    const pageSize = parsePositiveInteger(filter.pageSize, 10);
    const keyword = normalizeText(filter.keyword);
    const status = normalizeText(filter.status);
    const category = normalizeText(filter.category);

    const filtered = this.state.products.filter((item) => {
      const matchedKeyword = keyword ? item.name.includes(keyword) : true;
      const matchedStatus = status ? item.status === status : true;
      const matchedCategory = category ? item.category === category : true;
      return matchedKeyword && matchedStatus && matchedCategory;
    });

    return paginateArray(clone(filtered), page, pageSize);
  }

  async updateProduct(productId: string, payload: Partial<ProductItem>) {
    const target = this.state.products.find((item) => item.id === productId);

    if (!target) {
      return null;
    }

    Object.assign(target, pickProductPatch(payload), {
      updatedAt: formatDateTime(new Date()),
    });

    return clone(target);
  }

  async listOrders(filter: Partial<OrderFilter>) {
    const page = parsePositiveInteger(filter.page, 1);
    const pageSize = parsePositiveInteger(filter.pageSize, 10);
    const keyword = normalizeText(filter.keyword);
    const status = normalizeText(filter.status);
    const channel = normalizeText(filter.channel);

    const filtered = this.state.orders.filter((item) => {
      const matchedKeyword = keyword
        ? item.orderNo.includes(keyword) || item.customerName.includes(keyword)
        : true;
      const matchedStatus = status ? item.status === status : true;
      const matchedChannel = channel ? item.channel === channel : true;
      return matchedKeyword && matchedStatus && matchedChannel;
    });

    return paginateArray(clone(filtered), page, pageSize);
  }

  async getOrderById(orderId: string) {
    const target = this.state.orders.find((item) => item.id === orderId);
    return target ? clone(target) : null;
  }

  async listCampaigns(filter: Partial<CampaignFilter>) {
    const page = parsePositiveInteger(filter.page, 1);
    const pageSize = parsePositiveInteger(filter.pageSize, 10);
    const keyword = normalizeText(filter.keyword);
    const status = normalizeText(filter.status);

    const filtered = this.state.campaigns.filter((item) => {
      const matchedKeyword = keyword ? item.name.includes(keyword) : true;
      const matchedStatus = status ? item.status === status : true;
      return matchedKeyword && matchedStatus;
    });

    return paginateArray(clone(filtered), page, pageSize);
  }

  async getCampaignById(campaignId: string) {
    const target = this.state.campaigns.find((item) => item.id === campaignId);
    return target ? clone(target) : null;
  }

  async listAllUsers() {
    return clone(this.state.users);
  }

  async listAllProducts() {
    return clone(this.state.products);
  }

  async listAllOrders() {
    return clone(this.state.orders);
  }

  async listAllCampaigns() {
    return clone(this.state.campaigns);
  }

  snapshot() {
    return clone(this.state);
  }
}

export function createInMemoryRepository(seedData?: DemoState) {
  return new InMemoryRepository(seedData);
}
