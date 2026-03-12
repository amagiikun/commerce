# Smart Commerce Admin

这是一个用于展示电商品牌运营后台能力的示例项目。
当前仓库已经从 **纯前端 + 本地 Mock** 升级为 **Vue 3 前端 + Node.js 后端 + MySQL 数据库**。

## 技术栈

### 前端
- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Element Plus
- ECharts
- Axios
- Vitest

### 后端
- Node.js
- Express
- Prisma
- MySQL
- JWT
- bcryptjs
- Vitest + Supertest

## 当前能力

- 登录鉴权：支持 `admin`、`operator`、`marketing` 三个演示账号
- 数据看板：由后端基于订单、商品、活动数据实时聚合
- 商品管理：列表、筛选、分页、编辑更新
- 订单管理：列表、筛选、详情查看
- 活动管理：列表、筛选、详情查看
- 前后端联调：前端默认请求 `/api`，开发时通过 Vite 代理到 `http://localhost:3000`

## 目录结构

```text
src/                前端源码
server/             Node.js + Prisma + MySQL 后端
  prisma/           Prisma schema 与 seed
  src/              路由、仓储、鉴权、中间件
  tests/            后端接口测试
```

## 演示账号

- 管理员：`admin / 123456`
- 订单运营：`operator / 123456`
- 营销专员：`marketing / 123456`

## 本地准备

1. 准备一个可连接的 MySQL 数据库
2. 在 `server/.env` 中配置：

```env
PORT=3000
DATABASE_URL="mysql://root:password@127.0.0.1:3306/smart_commerce_admin"
JWT_SECRET="smart-commerce-dev-secret"
JWT_EXPIRES_IN="7d"
```

> 可先参考 `server/.env.example`

## 安装依赖

当前仓库根目录与 `server/` 目录都需要安装依赖。

```bash
npm install
cd server
npm install
```

## 初始化数据库

在仓库根目录执行：

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 启动方式

### 启动后端

```bash
npm run dev:server
```

### 启动前端

```bash
npm run dev:client
```

前端开发服务器会把 `/api` 自动代理到 `http://localhost:3000`。

## 测试与构建

### 前端测试

```bash
npm run test
```

### 后端测试

```bash
npm run test:server
```

### 前端构建

```bash
npm run build
```

### 后端构建

```bash
npm run build:server
```

## 说明

- `src/mock/` 目录目前保留为历史参考数据，不再参与实际请求链路
- 前端请求入口已经切到真实后端，401 会继续清理本地登录态
- 后端测试默认使用内存仓储，避免在测试阶段强依赖 MySQL 实例
