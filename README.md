# @caterpillarsoft/filter

一个功能强大、灵活且易于使用的 React 多重筛选条件组件，基于 Ant Design 构建。

![Multiple Filter Component Demo](./public/demo.gif)

*组件演示：展示筛选条件的添加、删除和交互过程*

## 目录

- [@caterpillarsoft/filter](#caterpillarsoftfilter)
  - [目录](#目录)
  - [简介](#简介)
  - [特性](#特性)
  - [安装](#安装)
    - [依赖安装](#依赖安装)
  - [快速开始](#快速开始)
  - [API 参考](#api-参考)
    - [MultipleFilter](#multiplefilter)
      - [属性](#属性)
    - [类型定义](#类型定义)
      - [FilterOption](#filteroption)
      - [AppliedFilter](#appliedfilter)
      - [FilterValue](#filtervalue)
      - [CustomFilterProps](#customfilterprops)
      - [FilterFormValues](#filterformvalues)
  - [使用示例](#使用示例)
    - [基础用法](#基础用法)
    - [设置初始筛选条件](#设置初始筛选条件)
    - [禁用状态](#禁用状态)
    - [自定义筛选类型](#自定义筛选类型)
    - [与 React Hook Form 集成](#与-react-hook-form-集成)
    - [受控模式使用](#受控模式使用)
    - [隐藏特定筛选选项](#隐藏特定筛选选项)
    - [自定义显示值渲染](#自定义显示值渲染)
  - [贡献](#贡献)
  - [许可证](#许可证)

## 简介

Multiple Filter Component 是一个用于处理复杂筛选场景的 React 组件。它允许用户通过直观的界面选择和应用多种筛选条件，支持文本输入、下拉选择、日期选择等多种筛选方式。组件以标签形式展示已应用的筛选条件，并支持单个或批量删除。

## 特性

- 🔍 支持多种筛选类型：文本输入、下拉选择、日期选择等
- 🏷️ 以标签形式展示已应用的筛选条件
- 🗑️ 支持删除单个筛选条件或清空全部条件
- 📱 响应式设计，适配各种屏幕尺寸
- 🎨 基于 Ant Design 构建，美观且可定制
- 📋 与 React Hook Form 集成，提供便捷的表单操作 API
- ♿ 完整的无障碍支持和键盘导航
- 🌙 支持亮色/暗色模式
- 🔒 支持禁用状态
- 🔄 支持设置初始筛选条件
- ✅ 支持多选模式，可选择多个选项后统一确认
- 🎯 基于 Ant Design 组件库，提供一致的设计语言
- 🎛️ 支持受控模式，提供更灵活的状态管理
- 👁️ 支持隐藏特定筛选选项
- 🎨 支持自定义筛选值显示格式
- 📊 支持复杂数据类型（对象、数组、布尔值等）

## 安装

### 依赖安装

```bash
# npm
npm install @caterpillarsoft/filter

# yarn
yarn add @caterpillarsoft/filter

# pnpm
pnpm add @caterpillarsoft/filter
```

## 快速开始

```tsx
import type { AppliedFilter, FilterOption } from '@caterpillarsoft/filter'
import { MultipleFilter } from '@caterpillarsoft/filter'
import { useState } from 'react'

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
  },
  {
    id: 'updateDate',
    label: '更新时间范围',
    type: 'dateRange'
  }
]

function App() {
  const [filters, setFilters] = useState<AppliedFilter[]>([])

  return (
    <div>
      <MultipleFilter
        filterOptions={filterOptions}
        onChange={setFilters}
        placeholder="请添加筛选条件"
      />
    </div>
  )
}
```

## API 参考

### MultipleFilter

`MultipleFilter` 是主要的组件，用于创建筛选条件界面。

#### 属性

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| `filterOptions` | `FilterOption[]` | ✅ | - | 可用的筛选选项列表 |
| `initialFilters` | `AppliedFilter[]` | ❌ | `[]` | 初始已应用的筛选条件 |
| `value` | `AppliedFilter[]` | ❌ | - | 当前已应用的筛选条件（受控模式） |
| `onChange` | `(filters: AppliedFilter[]) => void` | ❌ | - | 筛选条件变化时的回调函数 |
| `placeholder` | `string` | ❌ | `'添加筛选条件'` | 输入框占位符文本 |
| `disabled` | `boolean` | ❌ | `false` | 是否禁用组件 |
| `className` | `string` | ❌ | `''` | 自定义类名 |

### 类型定义

#### FilterOption

筛选选项的配置对象。

```typescript
interface FilterOption {
  /** 筛选项唯一标识 */
  id: string

  /** 筛选项显示名称 */
  label: string

  /** 是否隐藏 */
  hidden?: boolean

  /** 筛选项类型 */
  type: 'select' | 'date' | 'dateRange' | 'input' | 'custom'

  /** 筛选项可选值（当type为select时使用） */
  options?: Array<{
    /** 选项值 */
    value: FilterValue
    /** 选项标签 */
    label: string
  }>

  /** 是否允许多选（当type为select时使用） */
  multiple?: boolean

  /** 自定义渲染函数（当type为custom时使用） */
  renderCustomFilter?: (props: CustomFilterProps) => ReactNode

  /** 自定义显示值渲染函数 */
  renderDisplayValue?: (value: FilterValue) => string
}
```

#### AppliedFilter

已应用的筛选条件对象。

```typescript
interface AppliedFilter {
  /** 筛选项唯一标识 */
  optionId: string

  /** 筛选项显示名称 */
  label: string

  /** 筛选值 */
  value: FilterValue

  /** 筛选值的显示文本 */
  displayValue: string
}
```

#### FilterValue

筛选值的类型。

```typescript
type FilterValue = string | number | Date | Array<string | number> | Array<Date> | boolean | null | Record<string, any>
```

#### CustomFilterProps

自定义筛选渲染函数的属性。

```typescript
interface CustomFilterProps {
  /** 值变化时的回调函数 */
  onChange: (value: FilterValue) => void

  /** 当前值 */
  value: FilterValue

  /** 是否禁用 */
  disabled?: boolean
}
```

#### FilterFormValues

表单数据结构。

```typescript
interface FilterFormValues {
  /** 已应用的筛选条件列表 */
  filters: AppliedFilter[]

  /** 当前正在编辑的筛选条件 */
  currentFilter: {
    /** 选中的筛选项ID */
    optionId: string | null
    /** 当前筛选值 */
    value: FilterValue
  }
}
```

## 使用示例

### 基础用法

最基本的组件使用方式：

```tsx
import type { AppliedFilter, FilterOption } from '@caterpillarsoft/filter'
import { MultipleFilter } from '@caterpillarsoft/filter'
import { useState } from 'react'

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
  }
]

function BasicExample() {
  const [filters, setFilters] = useState<AppliedFilter[]>([])

  return (
    <MultipleFilter
      filterOptions={filterOptions}
      onChange={setFilters}
      placeholder="请添加筛选条件"
    />
  )
}
```

### 设置初始筛选条件

通过 `initialFilters` 属性设置初始筛选条件：

```tsx
import type { AppliedFilter, FilterOption } from '@caterpillarsoft/filter'
import { MultipleFilter } from '@caterpillarsoft/filter'
import { useState } from 'react'

function InitialFiltersExample() {
  // 定义初始筛选条件
  const initialFilters: AppliedFilter[] = [
    {
      optionId: 'status',
      label: '状态',
      value: 'running',
      displayValue: '运行中'
    },
    {
      optionId: 'name',
      label: '实例名称',
      value: 'server-01',
      displayValue: 'server-01'
    }
  ]

  const [filters, setFilters] = useState<AppliedFilter[]>(initialFilters)

  return (
    <MultipleFilter
      filterOptions={filterOptions}
      initialFilters={initialFilters}
      onChange={setFilters}
      placeholder="请添加筛选条件"
    />
  )
}
```

### 禁用状态

使用 `disabled` 属性禁用组件：

```tsx
import { MultipleFilter } from '@caterpillarsoft/filter'
import { useState } from 'react'

function DisabledExample() {
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <div>
      <button onClick={() => setIsDisabled(!isDisabled)}>
        {isDisabled ? '启用' : '禁用'}
      </button>

      <MultipleFilter
        filterOptions={filterOptions}
        disabled={isDisabled}
        onChange={setFilters}
      />
    </div>
  )
}
```

### 自定义筛选类型

使用 `custom` 类型创建自定义筛选方法：

```tsx
import { MultipleFilter } from '@caterpillarsoft/filter'
import { Button, Input } from 'antd'

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
            const min = Number(e.target.value)
            const max = (value as any)?.max
            onChange({ min, max })
          }}
          disabled={disabled}
        />
        <span>-</span>
        <Input
          type="number"
          placeholder="最高价"
          value={(value as any)?.max || ''}
          onChange={(e) => {
            const max = Number(e.target.value)
            const min = (value as any)?.min
            onChange({ min, max })
          }}
          disabled={disabled}
        />
        <Button
          onClick={() => {
            // 添加筛选条件的逻辑
          }}
          disabled={disabled}
        >
          确定
        </Button>
      </div>
    )
  }
]

function CustomFilterExample() {
  return (
    <MultipleFilter filterOptions={customFilterOptions} />
  )
}
```

### 与 React Hook Form 集成

组件内部已经集成了 React Hook Form，可以与表单一起使用：

```tsx
import { MultipleFilter } from '@caterpillarsoft/filter'
import { useForm } from 'react-hook-form'

function FormIntegrationExample() {
  const form = useForm({
    defaultValues: {
      searchTerm: '',
      filters: []
    }
  })

  const onSubmit = (data) => {
    console.log('表单数据:', data)
    // 执行搜索或其他操作
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input
        {...form.register('searchTerm')}
        placeholder="搜索关键词"
      />

      <MultipleFilter
        filterOptions={filterOptions}
        onChange={(filters) => {
          form.setValue('filters', filters)
        }}
      />

      <button type="submit">搜索</button>

      <button
        type="button"
        onClick={() => form.reset()}
      >
        重置
      </button>
    </form>
  )
}
```

### 受控模式使用

使用 `value` 属性实现受控模式：

```tsx
import { MultipleFilter } from '@caterpillarsoft/filter'
import { useState } from 'react'

function ControlledExample() {
  const [filters, setFilters] = useState<AppliedFilter[]>([])

  const handleFilterChange = (newFilters: AppliedFilter[]) => {
    setFilters(newFilters)
    // 可以在这里执行其他逻辑，比如触发搜索
    console.log('筛选条件变化:', newFilters)
  }

  return (
    <MultipleFilter
      filterOptions={filterOptions}
      value={filters}
      onChange={handleFilterChange}
      placeholder="请添加筛选条件"
    />
  )
}
```

### 隐藏特定筛选选项

使用 `hidden` 属性隐藏不需要的筛选选项：

```tsx
const filterOptionsWithHidden: FilterOption[] = [
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
    id: 'internalStatus',
    label: '内部状态',
    type: 'select',
    options: [
      { value: 'active', label: '活跃' },
      { value: 'inactive', label: '非活跃' }
    ],
    hidden: true // 这个选项将被隐藏
  }
]
```

### 自定义显示值渲染

使用 `renderDisplayValue` 自定义筛选值的显示格式：

```tsx
const filterOptionsWithCustomDisplay: FilterOption[] = [
  {
    id: 'price',
    label: '价格范围',
    type: 'custom',
    renderDisplayValue: (value) => {
      if (typeof value === 'object' && value !== null) {
        const { min, max } = value as { min?: number, max?: number }
        if (min && max) {
          return `¥${min} - ¥${max}`
        }
        else if (min) {
          return `≥ ¥${min}`
        }
        else if (max) {
          return `≤ ¥${max}`
        }
      }
      return '未设置'
    },
    renderCustomFilter: ({ onChange, value, disabled }) => (
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="最低价"
          value={(value as any)?.min || ''}
          onChange={(e) => {
            const min = Number(e.target.value)
            const max = (value as any)?.max
            onChange({ min, max })
          }}
          disabled={disabled}
        />
        <span>-</span>
        <Input
          type="number"
          placeholder="最高价"
          value={(value as any)?.max || ''}
          onChange={(e) => {
            const max = Number(e.target.value)
            const min = (value as any)?.min
            onChange({ min, max })
          }}
          disabled={disabled}
        />
      </div>
    )
  }
]
```

## 贡献

欢迎贡献代码、报告问题或提出新功能建议！请查看 [贡献指南](CONTRIBUTING.md) 了解更多信息。

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。
