# API 文档

## 基础约定

- 服务前缀：`/api`
- 认证方式：除登录外，其余接口都要求 `Authorization: Bearer <token>`
- 统一返回结构：

```ts
{
  code: number;
  message: string;
  data: T;
}
```

- `code = 0`：请求成功
- `401`：未登录或 token 失效
- `404`：资源不存在

## 登录

### `POST /api/auth/login`

请求体：

```ts
{
  username: string;
  password: string;
  role?: 'admin' | 'operator' | 'marketing';
}
```

成功返回：

```ts
{
  token: string;
  userInfo: {
    id: string;
    name: string;
    role: 'admin' | 'operator' | 'marketing';
    avatar?: string;
  };
  role: 'admin' | 'operator' | 'marketing';
}
```

## 看板

### `GET /api/dashboard/summary`

返回字段：

- `metrics`
- `trend`
- `hotProducts`
- `campaignSummary`

## 商品

### `GET /api/products`

查询参数：

```ts
{
  page: number;
  pageSize: number;
  keyword?: string;
  status?: 'on_sale' | 'draft' | 'sold_out';
  category?: string;
}
```

### `PATCH /api/products/:id`

支持更新字段：

- `name`
- `category`
- `price`
- `stock`
- `sales`
- `status`

## 订单

### `GET /api/orders`

查询参数：

```ts
{
  page: number;
  pageSize: number;
  keyword?: string;
  status?: 'pending' | 'paid' | 'shipping' | 'completed' | 'refund';
  channel?: string;
}
```

### `GET /api/orders/:id`

返回订单基础信息与 `items` 明细。

## 活动

### `GET /api/campaigns`

查询参数：

```ts
{
  page: number;
  pageSize: number;
  keyword?: string;
  status?: 'upcoming' | 'running' | 'ended';
}
```

### `GET /api/campaigns/:id`

返回活动预算、消耗、转化率、负责人等信息。

## 数据来源

- 演示账号和业务样例维护在 `server/src/fixtures/demo-data.ts`
- Prisma seed 通过同一份数据初始化 MySQL
- 前端 `src/types/index.ts` 与后端返回字段保持一致
