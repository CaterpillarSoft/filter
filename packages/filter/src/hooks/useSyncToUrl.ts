import type { AppliedFilter } from '../types'
import { useEffect, useState } from 'react'

/**
 * 同步筛选条件到 URL 的 Hook（基于 URLSearchParams）
 * @param initialFilters 默认筛选条件
 * @returns [当前筛选条件, 更新筛选条件的方法]
 */
export function useSyncToUrl(
  initialFilters: AppliedFilter[],
): [AppliedFilter[], (newFilters: AppliedFilter[]) => void] {
  // 兼容旧的对象格式
  const convertLegacyFormat = (legacy: Record<string, any>): AppliedFilter[] => {
    return Object.entries(legacy)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([optionId, value]) => ({
        optionId,
        label: optionId,
        value,
        displayValue: String(value),
      }))
  }

  // 解析当前 URL 的查询参数
  const parseFiltersFromUrl = (): AppliedFilter[] => {
    const searchParams = new URLSearchParams(window.location.search)
    const paramsValue = searchParams.get('filters')

    if (!paramsValue)
      return [...initialFilters]

    try {
      const parsed = JSON.parse(paramsValue)
      return Array.isArray(parsed) ? parsed : convertLegacyFormat(parsed)
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
      newSearchParams.set('filters', JSON.stringify(activeFilters))
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
