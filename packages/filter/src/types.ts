import type { ReactNode } from 'react'

/** 筛选值类型 */
export type FilterValue = string | number | Date | Array<string | number> | Array<Date> | null

/** 自定义筛选渲染函数的属性 */
export interface CustomFilterProps {
  /** 值变化时的回调函数 */
  onChange: (value: FilterValue) => void

  /** 当前值 */
  value: FilterValue

  /** 是否禁用 */
  disabled?: boolean
}

export interface FilterOption {
  /** 筛选项唯一标识 */
  id: string

  /** 筛选项显示名称 */
  label: string

  /** 筛选项类型 */
  type: 'select' | 'date' | 'dateRange' | 'input' | 'custom'

  /** 筛选项可选值（当type为select时使用） */
  options?: Array<{
    /** 选项值 */
    value: string | number
    /** 选项标签 */
    label: string
  }>

  /** 是否允许多选（当type为select时使用） */
  multiple?: boolean

  /** 自定义渲染函数（当type为custom时使用） */
  renderCustomFilter?: (props: CustomFilterProps) => ReactNode
}

export interface AppliedFilter {
  /** 筛选项唯一标识 */
  optionId: string

  /** 筛选项显示名称 */
  label: string

  /** 筛选值 */
  value: FilterValue

  /** 筛选值的显示文本 */
  displayValue: string
}

export interface MultipleFilterProps {
  /** 可用的筛选选项列表 */
  filterOptions: FilterOption[]

  /** 初始已应用的筛选条件 */
  initialFilters?: AppliedFilter[]

  /** 筛选条件变化时的回调函数 */
  onChange?: (filters: AppliedFilter[]) => void

  /** 输入框占位符文本 */
  placeholder?: string

  /** 是否禁用组件 */
  disabled?: boolean

  /** 自定义类名 */
  className?: string
}

// 表单数据结构
export interface FilterFormValues {
  filters: AppliedFilter[]
  currentFilter: {
    optionId: string | null
    value: FilterValue
  }
}
