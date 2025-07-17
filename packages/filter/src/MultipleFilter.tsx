import type { FC } from 'react'
import type { AppliedFilter, FilterFormValues, FilterOption, MultipleFilterProps } from './types'
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
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  CursorInput,
  DisabledTag,
  FilterContainer,
  FilterHeader,
  FilterTitle,
  FilterWrapper,
  InputWrapper,
  MultiSelectContainer,
  MultiSelectFooter,
  NoResultsMessage,
  OptionItem,
  OptionsList,
  PopoverContent,
  SearchInput,
  SelectedCount,
  TagsContainer,
} from './styles'

export const MultipleFilter: FC<MultipleFilterProps> = ({
  filterOptions,
  initialFilters = [],
  value,
  onChange,
  placeholder = '添加筛选条件',
  disabled = false,
  className = '',
}) => {
  const { control, setValue, watch, reset } = useForm<FilterFormValues>({
    defaultValues: {
      filters: value || initialFilters,
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

  // 搜索关键词状态
  const [searchKeyword, setSearchKeyword] = useState('')

  // 获取当前选中的筛选选项
  const selectedOption = currentFilterOptionId
    ? filterOptions.find(option => option.id === currentFilterOptionId)
    : null

  // 在受控模式下，当外部value变化时更新内部状态
  useEffect(() => {
    if (value) {
      setValue('filters', value)
    }
  }, [value])

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
    setSearchKeyword('') // 清空搜索关键词
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
      setSearchKeyword('') // 清空搜索关键词
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
   * 处理搜索关键词变化
   * @param value - 搜索关键词
   */
  const handleSearchChange = (value: string) => {
    setSearchKeyword(value)
  }

  /**
   * 根据搜索关键词过滤筛选选项
   * @returns 过滤后的筛选选项数组
   */
  const getFilteredOptions = () => {
    if (!searchKeyword.trim()) {
      return filterOptions
    }

    const keyword = searchKeyword.toLowerCase().trim()
    return filterOptions.filter(option =>
      option.label.toLowerCase().includes(keyword),
    )
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
              <MultiSelectContainer>
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
              </MultiSelectContainer>
              <Divider />
              <MultiSelectFooter>
                <SelectedCount>
                  已选择
                  {' '}
                  {multiSelectValues.length}
                  {' '}
                  项
                </SelectedCount>
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
              </MultiSelectFooter>
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
    <FilterContainer className={`multiple-filter ${className}`}>
      <FilterWrapper>
        {/* 搜索输入框 */}
        <InputWrapper>
          <Popover
            open={disabled ? false : isOpen}
            onOpenChange={handlePopoverOpenChange}
            trigger="click"
            placement="bottomLeft"
            content={(
              <PopoverContent>
                {!selectedOption
                  ? (
                      <>
                        <SearchInput
                          placeholder="搜索筛选条件..."
                          prefix={<SearchOutlined />}
                          size="small"
                          value={searchKeyword}
                          onChange={e => handleSearchChange(e.target.value)}
                        />
                        <OptionsList>
                          {getFilteredOptions().length > 0
                            ? (
                                getFilteredOptions().map(option => (
                                  <OptionItem
                                    key={option.id}
                                    onClick={() => handleSelectFilterOption(option)}
                                  >
                                    {option.label}
                                  </OptionItem>
                                ))
                              )
                            : (
                                <NoResultsMessage>
                                  未找到匹配的筛选条件
                                </NoResultsMessage>
                              )}
                        </OptionsList>
                      </>
                    )
                  : (
                      <>
                        <FilterHeader>
                          <FilterTitle>{selectedOption.label}</FilterTitle>
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
                        </FilterHeader>
                        {renderFilterMethod()}
                      </>
                    )}
              </PopoverContent>
            )}
          >
            <CursorInput
              placeholder={placeholder}
              prefix={<SearchOutlined />}
              readOnly
              onClick={handleInputClick}
              onBlur={handleInputBlur}
              disabled={disabled}
            />
          </Popover>
        </InputWrapper>

        {/* 已应用的筛选条件标签 */}
        {appliedFilters.length > 0 && (
          <TagsContainer>
            {appliedFilters.map(filter => (
              disabled
                ? (
                    <DisabledTag
                      key={`${filter.optionId}-${String(filter.value)}`}
                      closable={!disabled}
                      onClose={() => removeFilter(filter.optionId)}
                    >
                      {filter.label}
                      :
                      {filter.displayValue}
                    </DisabledTag>
                  )
                : (
                    <Tag
                      key={`${filter.optionId}-${String(filter.value)}`}
                      closable={!disabled}
                      onClose={() => removeFilter(filter.optionId)}
                    >
                      {filter.label}
                      :
                      {filter.displayValue}
                    </Tag>
                  )
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
          </TagsContainer>
        )}
      </FilterWrapper>
    </FilterContainer>
  )
}

export default MultipleFilter
