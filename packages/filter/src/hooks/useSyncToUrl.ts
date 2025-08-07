import type { AppliedFilter } from '../types'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { deserializeFilters, serializeFilters } from '../utils'

interface UseSyncToUrlReturn {
  filters: AppliedFilter[]
  updateFilters: (newFilters: AppliedFilter[]) => void
  pagination: { pageNum: number, pageSize: number }
  updatePagination: (pagination: { pageNum: number, pageSize: number }) => void
  filterParams: Record<string, any>
}

/**
 * 同步筛选条件和分页到 URL 的 Hook（基于 React Router 的 useSearchParams）
 * @param initialFilters 默认筛选条件
 * @returns [当前筛选条件, 更新筛选条件的方法, 分页信息, 更新分页的方法]
 */
export function useSyncToUrl(
  initialFilters: AppliedFilter[],
  paramsKey = 'filters',
): UseSyncToUrlReturn {
  const [searchParams, setSearchParams] = useSearchParams()

  // 解析当前 URL 的查询参数
  const parseFiltersFromUrl = (): AppliedFilter[] => {
    const paramsValue = searchParams.get(paramsKey)

    if (!paramsValue)
      return [...initialFilters]

    try {
      const parsed = JSON.parse(paramsValue)
      // 支持对象格式 {optionId: {value, label, displayValue}}
      return typeof parsed === 'object' && !Array.isArray(parsed)
        ? deserializeFilters(parsed)
        : [...initialFilters]
    }
    catch (error) {
      console.error('Failed to parse URL filters:', error)
      return [...initialFilters]
    }
  }

  // 获取分页信息
  const getPagination = () => ({
    pageNum: Number(searchParams.get('pageNum')) || 1,
    pageSize: Number(searchParams.get('pageSize')) || 20,
  })

  // 初始化状态
  const [filters, setFilters] = useState<AppliedFilter[]>(parseFiltersFromUrl)
  const [pagination, setPagination] = useState(getPagination())

  // 将 filters 转换为 key-value 形式
  const filterParams = useMemo(() => {
    const params: Record<string, any> = {}
    filters.forEach((filter) => {
      if (filter.value !== undefined && filter.value !== null) {
        // 处理数组类型的值，将其转换为逗号分隔的字符串
        if (Array.isArray(filter.value)) {
          params[filter.optionId] = filter.value.join(',')
        }
        else {
          params[filter.optionId] = filter.value
        }
      }
    })
    return params
  }, [filters])

  // 更新筛选条件并同步到 URL
  const updateFilters = (newFilters: AppliedFilter[]) => {
    const activeFilters = newFilters.filter(f =>
      f.value !== undefined && f.value !== null,
    )

    // 创建新的 URLSearchParams，保留现有的其他参数
    const newSearchParams = new URLSearchParams(searchParams)

    if (activeFilters.length > 0) {
      // 使用简化的格式保存到 URL
      const simplifiedData = serializeFilters(activeFilters)
      newSearchParams.set(paramsKey, JSON.stringify(simplifiedData))
    }
    else {
      // 如果没有筛选条件，删除该参数
      newSearchParams.delete(paramsKey)
    }

    // 当筛选条件改变时，重置到第一页
    newSearchParams.set('pageNum', '1')

    setSearchParams(newSearchParams, { replace: true })
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, pageNum: 1 }))
  }

  // 更新分页并同步到 URL
  const updatePagination = (newPagination: { pageNum: number, pageSize: number }) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('pageNum', newPagination.pageNum.toString())
    newSearchParams.set('pageSize', newPagination.pageSize.toString())
    setSearchParams(newSearchParams, { replace: true })
    setPagination(newPagination)
  }

  // 监听 URL 参数变化
  useEffect(() => {
    const currentFilters = parseFiltersFromUrl()
    const currentPagination = getPagination()

    // 避免不必要的状态更新
    setFilters((prev) => {
      const filtersChanged = JSON.stringify(prev) !== JSON.stringify(currentFilters)
      return filtersChanged ? currentFilters : prev
    })

    setPagination((prev) => {
      const paginationChanged = prev.pageNum !== currentPagination.pageNum || prev.pageSize !== currentPagination.pageSize
      return paginationChanged ? currentPagination : prev
    })
  }, [searchParams])

  return { filters, updateFilters, pagination, updatePagination, filterParams }
}
