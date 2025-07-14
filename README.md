# Multiple Filter Component

一个功能强大、灵活且易于使用的 React 多重筛选条件组件，基于 shadcn UI 构建

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📝 简介

Multiple Filter Component 是一个用于处理复杂筛选场景的 React 组件。它允许用户通过直观的界面选择和应用多种筛选条件，支持文本输入、下拉选择、日期选择等多种筛选方式。组件以标签形式展示已应用的筛选条件，并支持单个或批量删除。

## ✨ 特性

- 🔍 支持多种筛选类型：文本输入、下拉选择、日期选择等
- 🏷️ 以标签形式展示已应用的筛选条件
- 🗑️ 支持删除单个筛选条件或清空全部条件
- 📱 响应式设计，适配各种屏幕尺寸
- 🎨 基于 shadcn UI 构建，美观且可定制
- 📋 与 React Hook Form 集成，提供便捷的表单操作 API
- ♿ 完整的无障碍支持和键盘导航
- 🌙 支持亮色/暗色模式
- 🔒 支持禁用状态

## 🚀 安装

使用 npm:

```bash
npm install multiple-filter-component
```

使用 yarn:

```bash
yarn add multiple-filter-component
```

使用 pnpm:

```bash
pnpm add multiple-filter-component
```

## 🔧 基本使用

```tsx
import { MultipleFilter } from 'multiple-filter-component';
import type { FilterOption, AppliedFilter } from 'multiple-filter-component';
import { useState } from 'react';

// 定义筛选选项
const filterOptions: FilterOption[] = [
  {
    id: 'name',
    label: '实例名称',
    type: 'input'
  },
  {
    id: 'status',
    label: '状态',
    type: 'select',
    options: [
      { value: 'running', label: '运行中' },
      { value: 'stopped', label: '已停止' }
    ]
  },
  {
    id: 'createDate',
    label: '创建日期',
    type: 'date'
  }
];

function App() {
  const [filters, setFilters] = useState<AppliedFilter[]>([]);

  const handleFilterChange = (newFilters: AppliedFilter[]) => {
    setFilters(newFilters);
    console.log('筛选条件变化:', newFilters);
    
    // 这里可以根据筛选条件进行数据查询等操作
  };

  return (
    <div>
      <MultipleFilter 
        filterOptions={filterOptions} 
        onChange={handleFilterChange}
        placeholder="请添加筛选条件"
      />
      
      {/* 显示当前筛选条件 */}
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </div>
  );
}
```

## 📖 API 文档

### MultipleFilter 组件

#### 属性

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| filterOptions | FilterOption[] | 是 | - | 可用的筛选选项列表 |
| initialFilters | AppliedFilter[] | 否 | [] | 初始已应用的筛选条件 |
| onChange | (filters: AppliedFilter[]) => void | 否 | - | 筛选条件变化时的回调函数 |
| placeholder | string | 否 | '添加筛选条件' | 输入框占位符文本 |
| disabled | boolean | 否 | false | 是否禁用组件 |
| className | string | 否 | '' | 自定义类名 |

### 类型定义

#### FilterOption

```typescript
type FilterOption = {
  /** 筛选项唯一标识 */
  id: string;
  /** 筛选项显示名称 */
  label: string;
  /** 筛选项类型: 'select' | 'date' | 'dateRange' | 'input' | 'custom' */
  type: 'select' | 'date' | 'dateRange' | 'input' | 'custom';
  /** 筛选项可选值（当type为select时使用） */
  options?: Array<{
    /** 选项值 */
    value: string | number;
    /** 选项标签 */
    label: string;
  }>;
  /** 是否允许多选（当type为select时使用） */
  multiple?: boolean;
  /** 自定义渲染函数（当type为custom时使用） */
  renderCustomFilter?: (props: CustomFilterProps) => ReactNode;
};
```

#### AppliedFilter

```typescript
type AppliedFilter = {
  /** 筛选项唯一标识 */
  optionId: string;
  /** 筛选项显示名称 */
  label: string;
  /** 筛选值 */
  value: FilterValue;
  /** 筛选值的显示文本 */
  displayValue: string;
};
```

#### FilterValue

```typescript
type FilterValue = string | number | Date | Array<string | number> | null;
```

#### CustomFilterProps

```typescript
interface CustomFilterProps {
  /** 值变化时的回调函数 */
  onChange: (value: FilterValue) => void;
  /** 当前值 */
  value: FilterValue;
  /** 是否禁用 */
  disabled?: boolean;
}
```

## 🧩 高级用法

### 自定义筛选类型

您可以使用 `custom` 类型创建自定义的筛选方法：

```tsx
const customFilterOptions: FilterOption[] = [
  // ... 其他选项
  {
    id: 'price',
    label: '价格范围',
    type: 'custom',
    renderCustomFilter: ({ onChange, value, disabled }) => (
      <div className="flex gap-2">
        <Input 
          type="number" 
          placeholder="最低价" 
          value={(value as any)?.min || ''} 
          onChange={(e) => {
            const min = Number(e.target.value);
            const max = (value as any)?.max;
            onChange({ min, max });
          }}
          disabled={disabled}
        />
        <span>-</span>
        <Input 
          type="number" 
          placeholder="最高价" 
          value={(value as any)?.max || ''} 
          onChange={(e) => {
            const max = Number(e.target.value);
            const min = (value as any)?.min;
            onChange({ min, max });
          }}
          disabled={disabled}
        />
        <Button 
          onClick={() => {
            // 处理确认逻辑
          }}
          disabled={disabled}
        >
          确定
        </Button>
      </div>
    )
  }
];
```

### 与 React Hook Form 集成

组件内部已经集成了 React Hook Form，您可以利用它提供的强大功能：

```tsx
import { useForm } from 'react-hook-form';

function FilterForm() {
  const form = useForm({
    defaultValues: {
      searchTerm: '',
      // 其他表单字段
    }
  });
  
  const onSubmit = (data) => {
    // 处理表单提交
    console.log('表单数据:', data);
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('searchTerm')} />
      
      <MultipleFilter 
        filterOptions={filterOptions}
        onChange={(filters) => {
          // 将筛选条件与表单集成
          form.setValue('filters', filters);
        }}
      />
      
      <button type="submit">搜索</button>
    </form>
  );
}
```

## 🤝 贡献

欢迎贡献代码、报告问题或提出新功能建议！请查看 [贡献指南](CONTRIBUTING.md) 了解更多信息。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。
