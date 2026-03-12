# 架构说明

## 总览

项目目前采用 **前后端分离** 结构：

```text
浏览器
  -> Vite 前端（Vue 3）
  -> /api 代理
  -> Express 后端
  -> Prisma
  -> MySQL
```

前端页面、状态管理和路由权限仍然保留在 `src/`。
后端接口、鉴权、数据库访问与 seed 数据集中在 `server/`。

## 前端分层

- `src/views/`：页面视图
- `src/components/`：业务组件与通用组件
- `src/api/`：前端接口调用入口
- `src/utils/request.ts`：Axios 实例与统一响应拦截
- `src/stores/`：Pinia 状态管理
- `src/router/`：路由与前端权限控制

## 后端分层

- `server/src/routes/`：按业务拆分的路由
- `server/src/data/`：仓储实现，包含内存仓储与 Prisma 仓储
- `server/src/middleware/`：鉴权与错误处理
- `server/src/utils/`：JWT、分页、日期格式、看板聚合等工具
- `server/prisma/`：Prisma schema 与初始化 seed

## 鉴权流程

1. 前端登录页调用 `POST /api/auth/login`
2. 后端校验数据库中的账号密码哈希
3. 登录成功后签发 JWT
4. 前端将 token 写入本地存储
5. 后续请求通过 `Authorization: Bearer <token>` 访问受保护接口
6. 若后端返回 401，前端会清理本地登录态

## 数据模型

Prisma schema 定义以下核心实体：

- `User`
- `Product`
- `Order`
- `OrderLine`
- `Campaign`

其中：
- 商品、订单、活动列表接口继续保持与前端现有字段结构兼容
- 订单商品明细拆分为独立的 `OrderLine`
- 看板数据由后端根据商品、订单、活动数据动态聚合生成

## 接口约定

所有接口继续使用统一返回结构：

```ts
{
  code: number;
  message: string;
  data: T;
}
```

已实现接口：

- `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `GET /api/products`
- `PATCH /api/products/:id`
- `GET /api/orders`
- `GET /api/orders/:id`
- `GET /api/campaigns`
- `GET /api/campaigns/:id`

## 测试策略

- 前端：继续使用 Vitest，覆盖路由、工具函数和页面结构
- 后端：使用 Vitest + Supertest 做接口级测试
- 后端测试默认注入内存仓储，保证测试稳定、快速、可重复

## 本地联调

- 前端开发服务器运行在 Vite 默认端口
- 后端运行在 `3000`
- `vite.config.ts` 已配置 `/api -> http://localhost:3000` 代理
