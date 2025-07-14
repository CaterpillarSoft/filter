# 复杂筛选条件组件 (Multiple Filter Component)

## 需求描述

开发一个复杂的筛选条件组件，具有以下特点：

1. 基本形式是一个输入框
2. 点击输入框后，以下拉菜单形式显示可选的筛选项
3. 选择筛选项后，显示对应的筛选方法（如日期选择器、下拉选择、自定义输入等）
4. 已选择的筛选条件以标签形式展示在某个区域
5. 支持删除单个筛选条件或清除全部条件
6. 支持多种复杂筛选模式：日期筛选、选择筛选、自定义筛选等
7. 基于 shadcn UI 组件库开发
8. 采用表单形式实现（如使用 React Hook Form），提高易用性

## 技术栈

- React
- TypeScript
- shadcn UI
- React Hook Form

## 开发计划

1. 设计组件接口和数据结构
2. 实现基础输入框和下拉菜单
3. 实现各类筛选方法（日期、选择、自定义等）
4. 实现筛选条件标签展示和删除功能
5. 集成 React Hook Form
6. 编写文档和示例

## 使用示例

### 基本使用

```tsx
import { MultipleFilter } from './components/multipleFilter';
import type { FilterOption, AppliedFilter } from './components/multipleFilter';
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

function MyComponent() {
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

### 组件属性

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| filterOptions | FilterOption[] | 是 | - | 可用的筛选选项列表 |
| initialFilters | AppliedFilter[] | 否 | [] | 初始已应用的筛选条件 |
| onChange | (filters: AppliedFilter[]) => void | 否 | - | 筛选条件变化时的回调函数 |
| placeholder | string | 否 | '添加筛选条件' | 输入框占位符文本 |
| disabled | boolean | 否 | false | 是否禁用组件 |
| className | string | 否 | '' | 自定义类名 |

### 类型定义

```tsx
/**
 * 筛选项类型定义
 */
export type FilterOption = {
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
  renderCustomFilter?: (props: { onChange: (value: any) => void; value: any }) => React.ReactNode;
};

/**
 * 已应用的筛选条件类型
 */
export type AppliedFilter = {
  /** 筛选项唯一标识 */
  optionId: string;
  /** 筛选项显示名称 */
  label: string;
  /** 筛选值 */
  value: any;
  /** 筛选值的显示文本 */
  displayValue: string;
};
```
