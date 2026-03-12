# 开发说明

## 前置要求

- Node.js 18+
- MySQL 8+
- npm 可用

## 开发流程

1. 安装前端依赖：`npm install`
2. 安装后端依赖：`cd server && npm install`
3. 创建 `server/.env`
4. 执行迁移：`npm run db:migrate`
5. 执行 seed：`npm run db:seed`
6. 启动后端：`npm run dev:server`
7. 启动前端：`npm run dev`

## 接口约定

- 所有业务接口统一使用 `/api` 前缀
- 统一返回结构：

```ts
{
  code: number;
  message: string;
  data: T;
}
```

- `code = 0` 表示成功
- `401` 表示未登录或登录过期
- `404` 表示资源不存在

## 本地验证建议

由于当前项目包含前端页面、权限逻辑和真实后端服务，建议至少执行：

```bash
npm run test
npm run build
npm run test:server
npm run build:server
```

## 数据维护

- 演示账号与样例业务数据统一维护在 `server/src/fixtures/demo-data.ts`
- Prisma seed 通过同一份数据源初始化 MySQL
- 修改前端接口字段时，需同步校验 `src/types/index.ts` 与后端 DTO 映射
