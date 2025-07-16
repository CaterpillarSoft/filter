import type { FC, ReactNode } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  Popover,
  Select,
  Space,
  Tag,
} from 'antd'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useState } from 'react'

import { Controller, useForm } from 'react-hook-form'

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
interface FilterFormValues {
  filters: AppliedFilter[]
  currentFilter: {
    optionId: string | null
    value: FilterValue
  }
}

export const MultipleFilter: FC<MultipleFilterProps> = ({
  filterOptions,
  initialFilters = [],
  onChange,
  placeholder = '添加筛选条件',
  disabled = false,
  className = '',
}) => {
  const { control, setValue, watch, reset } = useForm<FilterFormValues>({
    defaultValues: {
      filters: initialFilters,
      currentFilter: {
        optionId: null,
        value: null,
      },
    },
  })

  const appliedFilters = watch('filters')
  const currentFilterOptionId = watch('currentFilter.optionId')
  const currentFilterValue = watch('currentFilter.value')

  // 多选临时状态
  const [multiSelectValues, setMultiSelectValues] = useState<Array<string | number>>([])

  // 控制下拉菜单的开关状态
  const [isOpen, setIsOpen] = useState(false)

  // 获取当前选中的筛选选项
  const selectedOption = currentFilterOptionId
    ? filterOptions.find(option => option.id === currentFilterOptionId)
    : null

  /**
   * 处理筛选条件变化
   * @param newFilters - 新的筛选条件数组
   */
  const handleFilterChange = (newFilters: AppliedFilter[]) => {
    setValue('filters', newFilters)
    onChange?.(newFilters)
  }

  /**
   * 添加筛选条件
   * 如果同一选项已存在筛选条件，会先移除旧的再添加新的
   * @param filter - 要添加的筛选条件对象
   */
  const addFilter = (filter: AppliedFilter) => {
    // 移除同一选项的现有筛选条件（如果存在）
    const filteredFilters = appliedFilters.filter(existingFilter =>
      existingFilter.optionId !== filter.optionId,
    )

    // 添加新的筛选条件
    const newFilters = [...filteredFilters, filter]
    handleFilterChange(newFilters)
    setIsOpen(false)

    // 重置当前筛选项
    setValue('currentFilter', {
      optionId: null,
      value: null,
    })
    setMultiSelectValues([])
  }

  /**
   * 添加多选筛选条件
   * @param optionId - 选项ID
   * @param label - 选项标签
   * @param values - 选中的值数组
   */
  const addMultiSelectFilter = (optionId: string, label: string, values: Array<string | number>) => {
    if (values.length === 0)
      return

    // 移除同一选项的现有筛选条件（如果存在）
    const filteredFilters = appliedFilters.filter(existingFilter =>
      existingFilter.optionId !== optionId,
    )

    // 添加新的筛选条件
    const newFilter: AppliedFilter = {
      optionId,
      label,
      value: values,
      displayValue: values.join(', '),
    }

    const newFilters = [...filteredFilters, newFilter]
    handleFilterChange(newFilters)
    setIsOpen(false)

    // 重置当前筛选项
    setValue('currentFilter', {
      optionId: null,
      value: null,
    })
    setMultiSelectValues([])
  }

  /**
   * 删除指定的筛选条件
   * @param optionId - 要删除的筛选条件的选项ID
   */
  const removeFilter = (optionId: string) => {
    if (disabled)
      return
    const newFilters = appliedFilters.filter(filter => filter.optionId !== optionId)
    handleFilterChange(newFilters)
  }

  /**
   * 重置所有筛选条件
   * 清空所有已应用的筛选条件并重置当前选中的筛选项
   */
  const resetAllFilters = () => {
    if (disabled)
      return
    reset({
      filters: [],
      currentFilter: {
        optionId: null,
        value: null,
      },
    })
    setMultiSelectValues([])
    onChange?.([])
  }

  /**
   * 选择筛选项
   * 设置当前选中的筛选项并清空其值
   * @param option - 选中的筛选选项
   */
  const handleSelectFilterOption = (option: FilterOption) => {
    if (disabled)
      return
    setValue('currentFilter.optionId', option.id)
    setValue('currentFilter.value', null)
    setMultiSelectValues([])
  }

  /**
   * 处理输入框点击事件
   * 打开筛选选项的下拉菜单
   */
  const handleInputClick = () => {
    if (disabled)
      return
    setIsOpen(true)
  }

  /**
   * 处理输入框失焦事件
   * 延迟清空当前未完成的筛选项，避免与点击事件冲突
   */
  const handleInputBlur = () => {
    // 延迟清空，避免与点击事件冲突
    setTimeout(() => {
      if (!isOpen) {
        setValue('currentFilter.optionId', null)
        setValue('currentFilter.value', null)
        setMultiSelectValues([])
      }
    }, 100)
  }

  /**
   * 处理弹出层开关状态变化
   * @param open - 弹出层是否打开
   */
  const handlePopoverOpenChange = (open: boolean) => {
    if (disabled)
      return
    setIsOpen(open)

    // 当弹出层关闭时，清空当前未完成的筛选选项
    if (!open) {
      setValue('currentFilter.optionId', null)
      setValue('currentFilter.value', null)
      setMultiSelectValues([])
    }
  }

  /**
   * 处理多选值变化
   * @param values - 选中的值数组
   */
  const handleMultiSelectChange = (values: Array<string | number>) => {
    setMultiSelectValues(values)
  }

  /**
   * 确认多选结果
   */
  const confirmMultiSelect = () => {
    if (!selectedOption || !multiSelectValues.length)
      return
    addMultiSelectFilter(selectedOption.id, selectedOption.label, multiSelectValues)
  }

  /**
   * 渲染筛选项的筛选方法
   * 根据选中的筛选项类型渲染对应的筛选控件
   * @returns 渲染的筛选控件组件或null
   */
  const renderFilterMethod = () => {
    if (!selectedOption)
      return null

    switch (selectedOption.type) {
      case 'select':
        if (selectedOption.multiple) {
          // 多选模式
          return (
            <>
              <div className="max-h-48 overflow-y-auto">
                <Checkbox.Group
                  value={multiSelectValues}
                  onChange={handleMultiSelectChange}
                  disabled={disabled}
                >
                  <Space direction="vertical" className="w-full">
                    {selectedOption.options?.map(option => (
                      <Checkbox
                        key={option.value.toString()}
                        value={option.value}
                        className="w-full"
                      >
                        {option.label}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  已选择
                  {' '}
                  {multiSelectValues.length}
                  {' '}
                  项
                </span>
                <Space>
                  <Button
                    size="small"
                    onClick={() => setMultiSelectValues([])}
                    disabled={disabled}
                  >
                    清空
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={confirmMultiSelect}
                    disabled={disabled || multiSelectValues.length === 0}
                  >
                    确定
                  </Button>
                </Space>
              </div>
            </>
          )
        }
        else {
          // 单选模式
          return (
            <Select
              placeholder={`选择${selectedOption.label}`}
              className="w-full"
              disabled={disabled}
              onChange={(value) => {
                if (disabled || !selectedOption.options)
                  return
                const selectedOptionItem = selectedOption.options.find(opt => opt.value.toString() === value)
                if (!selectedOptionItem)
                  return

                addFilter({
                  optionId: selectedOption.id,
                  label: selectedOption.label,
                  value: selectedOptionItem.value,
                  displayValue: selectedOptionItem.label,
                })
              }}
            >
              {selectedOption.options?.map(option => (
                <Select.Option key={option.value.toString()} value={option.value.toString()}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          )
        }

      case 'input':
        return (
          <Controller
            name="currentFilter.value"
            control={control}
            render={({ field }) => (
              <Input
                placeholder={`输入${selectedOption.label}，按回车确认`}
                value={field.value as string || ''}
                onChange={e => field.onChange(e.target.value)}
                onPressEnter={() => {
                  if (disabled)
                    return
                  const value = field.value
                  if (!value)
                    return
                  addFilter({
                    optionId: selectedOption.id,
                    label: selectedOption.label,
                    value,
                    displayValue: value as string,
                  })
                }}
                disabled={disabled}
              />
            )}
          />
        )

      case 'date':
        return (
          <Controller
            name="currentFilter.value"
            control={control}
            render={({ field }) => (
              <DatePicker
                className="w-full"
                placeholder="选择日期"
                onChange={(date) => {
                  if (!date)
                    return
                  const dateObj = date.toDate()
                  field.onChange(dateObj)
                  // 选择日期后自动添加筛选条件
                  addFilter({
                    optionId: selectedOption.id,
                    label: selectedOption.label,
                    value: dateObj,
                    displayValue: format(dateObj, 'yyyy-MM-dd', { locale: zhCN }),
                  })
                }}
                disabled={disabled}
              />
            )}
          />
        )

      case 'dateRange':
        return (
          <Controller
            name="currentFilter.value"
            control={control}
            render={({ field }) => (
              <DatePicker.RangePicker
                className="w-full"
                placeholder={['开始日期', '结束日期']}
                onChange={(dates) => {
                  if (!dates || !dates[0] || !dates[1])
                    return
                  const [startDate, endDate] = dates
                  const dateRange = [startDate.toDate(), endDate.toDate()]
                  field.onChange(dateRange)

                  // 选择日期范围后自动添加筛选条件
                  addFilter({
                    optionId: selectedOption.id,
                    label: selectedOption.label,
                    value: dateRange,
                    displayValue: `${format(startDate.toDate(), 'yyyy-MM-dd', { locale: zhCN })} 至 ${format(endDate.toDate(), 'yyyy-MM-dd', { locale: zhCN })}`,
                  })
                }}
                disabled={disabled}
              />
            )}
          />
        )

      case 'custom':
        return selectedOption.renderCustomFilter?.({
          onChange: (value) => {
            if (disabled)
              return
            setValue('currentFilter.value', value)
          },
          value: currentFilterValue,
          disabled,
        })

      default:
        return <div>暂不支持的筛选类型</div>
    }
  }

  return (
    <div className={`multiple-filter ${className}`}>
      <div className="flex flex-col space-y-2">
        {/* 搜索输入框 */}
        <div className="relative flex-1">
          <Popover
            open={disabled ? false : isOpen}
            onOpenChange={handlePopoverOpenChange}
            trigger="click"
            placement="bottomLeft"
            content={(
              <div className="w-80">
                {!selectedOption
                  ? (
                      <>
                        <div className="mb-2">
                          <Input
                            placeholder="搜索筛选条件..."
                            prefix={<SearchOutlined />}
                            size="small"
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filterOptions.map(option => (
                            <div
                              key={option.id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                              onClick={() => handleSelectFilterOption(option)}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      </>
                    )
                  : (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium m-0">{selectedOption.label}</h4>
                          <Button
                            type="text"
                            size="small"
                            onClick={() => {
                              if (disabled)
                                return
                              setValue('currentFilter.optionId', null)
                            }}
                            disabled={disabled}
                          >
                            返回
                          </Button>
                        </div>
                        {renderFilterMethod()}
                      </>
                    )}
              </div>
            )}
          >
            <Input
              placeholder={placeholder}
              prefix={<SearchOutlined />}
              readOnly
              onClick={handleInputClick}
              onBlur={handleInputBlur}
              disabled={disabled}
              className="cursor-pointer"
            />
          </Popover>
        </div>

        {/* 已应用的筛选条件标签 */}
        {appliedFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {appliedFilters.map(filter => (
              <Tag
                key={`${filter.optionId}-${String(filter.value)}`}
                closable={!disabled}
                onClose={() => removeFilter(filter.optionId)}
                className={disabled ? 'opacity-70' : ''}
              >
                {filter.label}
                :
                {filter.displayValue}
              </Tag>
            ))}

            {appliedFilters.length > 0 && (
              <Button
                type="text"
                size="small"
                onClick={resetAllFilters}
                disabled={disabled}
              >
                清空
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MultipleFilter
