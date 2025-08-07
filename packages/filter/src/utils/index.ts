import type { SelectProps } from 'antd'
import type { ReactNode } from 'react'
import type { AppliedFilter } from '../types'

// 提取 ReactNode 中的文本内容
function extractTextFromReactNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join('')
  }

  if (node && typeof node === 'object' && 'props' in node) {
    const { item } = node.props || {}
    if (item) {
      return extractTextFromReactNode(item?.name)
    }
  }

  return ''
}

export const filterOption: SelectProps['filterOption'] = (input, option) => {
  if (!option)
    return false

  // 处理可能存在的React节点内容
  const label
    = typeof option.label === 'string'
      ? option.label
      : extractTextFromReactNode(option.label)
  const value
    = typeof option.value === 'string'
      ? option.value
      : String(option.value)

  return (
    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
    || label.toLowerCase().includes(input.toLowerCase())
    || value.toLowerCase().includes(input.toLowerCase())
  )
}

// 将 AppliedFilter[] 转换为简化的 URL 格式 {optionId: value}
export function serializeFilters(filters: AppliedFilter[]): Record<string, any> {
  return filters.reduce((result, filter) => {
    if (filter.value !== undefined && filter.value !== null) {
      result[filter.optionId] = {
        value: filter.value,
        label: filter.label,
        displayValue: filter.displayValue,
      }
    }
    return result
  }, {} as Record<string, any>)
}

// 将 URL 格式转换为 AppliedFilter[]
export function deserializeFilters(data: Record<string, any>): AppliedFilter[] {
  return Object.entries(data)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([optionId, value]) => ({
      optionId,
      label: value.label || optionId,
      value: value.value,
      displayValue: value.displayValue || String(value.value),
    }))
}
