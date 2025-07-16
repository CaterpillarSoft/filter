# @caterpillarsoft/filter

一个基于 React 的多条件筛选组件，使用 Ant Design 和 React Hook Form 构建。

## 构建

本项目使用 Rollup 进行构建，支持以下命令：

```bash
# 构建生产版本
pnpm build

# 仅构建类型声明文件
pnpm build:types

# 开发模式（监听文件变化）
pnpm dev
```

## 构建输出

构建完成后，会在 `dist` 目录下生成以下文件：

- `index.mjs` - ES Module 格式
- `index.js` - CommonJS 格式
- `index.d.ts` - TypeScript 类型声明文件
- 对应的 sourcemap 文件

## 技术栈

- React 19
- TypeScript
- Ant Design
- React Hook Form
- date-fns
- Rollup (构建工具)

## 外部依赖

以下依赖被标记为外部依赖，不会被打包到最终的构建文件中：

- react
- react-dom
- antd
- @ant-design/icons
- date-fns
- date-fns/locale
- react-hook-form
