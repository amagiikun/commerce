# Mock 接口说明（历史参考）

> 当前项目已经默认切换到 `server/` 目录下的真实 Node.js + MySQL 后端。
> 本文档保留的 `src/mock/` 仅作为演示数据来源参考，不再参与运行时请求链路。

## 当前实际请求链路

```text
前端页面
  -> src/api/*
  -> src/utils/request.ts
  -> /api
  -> Vite 代理（开发环境）
  -> http://localhost:3000
  -> Express + Prisma + MySQL
```

## 保留 Mock 的目的

- 作为初始演示数据的来源参考
- 便于对照前后端字段结构
- 便于理解旧版本的本地联调方式

## 已迁移到后端的接口

- `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `GET /api/products`
- `PATCH /api/products/:id`
- `GET /api/orders`
- `GET /api/orders/:id`
- `GET /api/campaigns`
- `GET /api/campaigns/:id`

## 说明

- `src/mock/__tests__/api-shapes.spec.ts` 已不再纳入前端测试集合
- 如需本地联调，请优先启动 `server/` 后端，而不是恢复 mock adapter
