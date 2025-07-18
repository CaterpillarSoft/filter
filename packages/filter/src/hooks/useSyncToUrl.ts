import type { AppliedFilter } from '../types'
import { useEffect, useState } from 'react'

/**
 * 同步筛选条件到 URL 的 Hook（基于 URLSearchParams）
 * @param initialFilters 默认筛选条件
 * @returns [当前筛选条件, 更新筛选条件的方法]
 */
export function useSyncToUrl(
  initialFilters: AppliedFilter[],
  paramsKey = 'filters',
): [AppliedFilter[], (newFilters: AppliedFilter[]) => void] {
  // 将 AppliedFilter[] 转换为简化的 URL 格式 {optionId: value}
  const serializeFilters = (filters: AppliedFilter[]): Record<string, any> => {
    const result: Record<string, any> = {}
    filters.forEach((filter) => {
      if (filter.value !== undefined && filter.value !== null) {
        result[filter.optionId] = filter.value
      }
    })
    return result
  }

  // 将简化的 URL 格式转换为 AppliedFilter[]
  const deserializeFilters = (data: Record<string, any>): AppliedFilter[] => {
    return Object.entries(data)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([optionId, value]) => ({
        optionId,
        label: optionId, // 简化处理，使用 optionId 作为 label
        value,
        displayValue: String(value),
      }))
  }

  // 解析当前 URL 的查询参数
  const parseFiltersFromUrl = (): AppliedFilter[] => {
    const searchParams = new URLSearchParams(window.location.search)
    const paramsValue = searchParams.get(paramsKey)

    if (!paramsValue)
      return [...initialFilters]

    try {
      const parsed = JSON.parse(paramsValue)
      // 支持新的简化格式 {optionId: value} 和旧的数组格式
      return typeof parsed === 'object' && !Array.isArray(parsed)
        ? deserializeFilters(parsed)
        : Array.isArray(parsed)
          ? parsed
          : [...initialFilters]
    }
    catch (error) {
      console.error('Failed to parse URL filters:', error)
      return [...initialFilters]
    }
  }

  // 初始化状态
  const [filters, setFilters] = useState<AppliedFilter[]>(parseFiltersFromUrl)

  // 更新筛选条件并同步到 URL
  const updateFilters = (newFilters: AppliedFilter[]) => {
    const activeFilters = newFilters.filter(f =>
      f.value !== undefined && f.value !== null,
    )

    const newSearchParams = new URLSearchParams()
    if (activeFilters.length > 0) {
      // 使用简化的格式保存到 URL
      const simplifiedData = serializeFilters(activeFilters)
      newSearchParams.set(paramsKey, JSON.stringify(simplifiedData))
    }

    const newUrl = newSearchParams.toString()
      ? `${window.location.pathname}?${newSearchParams.toString()}`
      : window.location.pathname

    window.history.replaceState(null, '', newUrl)
    setFilters(newFilters)
  }

  // 监听浏览器前进/后退
  useEffect(() => {
    const handlePopState = () => {
      setFilters(parseFiltersFromUrl())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return [filters, updateFilters]
}
