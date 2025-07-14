import { useState, type FC, type ReactNode } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Calendar as CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

/** 筛选值类型 */
export type FilterValue = string | number | Date | Array<string | number> | null;

/** 自定义筛选渲染函数的属性 */
export interface CustomFilterProps {
  /** 值变化时的回调函数 */
  onChange: (value: FilterValue) => void;
  /** 当前值 */
  value: FilterValue;
  /** 是否禁用 */
  disabled?: boolean;
}

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
  renderCustomFilter?: (props: CustomFilterProps) => ReactNode;
};

export type AppliedFilter = {
  /** 筛选项唯一标识 */
  optionId: string;
  /** 筛选项显示名称 */
  label: string;
  /** 筛选值 */
  value: FilterValue;
  /** 筛选值的显示文本 */
  displayValue: string;
};

export interface MultipleFilterProps {
  /** 可用的筛选选项列表 */
  filterOptions: FilterOption[];
  /** 初始已应用的筛选条件 */
  initialFilters?: AppliedFilter[];
  /** 筛选条件变化时的回调函数 */
  onChange?: (filters: AppliedFilter[]) => void;
  /** 输入框占位符文本 */
  placeholder?: string;
  /** 是否禁用组件 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}

// 表单数据结构
interface FilterFormValues {
  filters: AppliedFilter[];
  currentFilter: {
    optionId: string | null;
    value: FilterValue;
  };
}

export const MultipleFilter: FC<MultipleFilterProps> = ({
  filterOptions,
  initialFilters = [],
  onChange,
  placeholder = '添加筛选条件',
  disabled = false,
  className = '',
}) => {
  // 使用 React Hook Form
  const { control, setValue, watch, reset, getValues } = useForm<FilterFormValues>({
    defaultValues: {
      filters: initialFilters,
      currentFilter: {
        optionId: null,
        value: null
      }
    }
  });

  // 从表单中获取值
  const appliedFilters = watch('filters');
  const currentFilterOptionId = watch('currentFilter.optionId');
  const currentFilterValue = watch('currentFilter.value');
  
  // 控制下拉菜单的开关状态
  const [isOpen, setIsOpen] = useState(false);
  // 日期选择器开关状态
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  // 获取当前选中的筛选选项
  const selectedOption = currentFilterOptionId 
    ? filterOptions.find(option => option.id === currentFilterOptionId) 
    : null;
  
  // 处理筛选条件变化
  const handleFilterChange = (newFilters: AppliedFilter[]) => {
    setValue('filters', newFilters);
    onChange?.(newFilters);
  };
  
  // 添加筛选条件
  const addFilter = (filter: AppliedFilter) => {
    const newFilters = [...appliedFilters, filter];
    handleFilterChange(newFilters);
    setIsOpen(false);
    
    // 重置当前筛选项
    setValue('currentFilter', {
      optionId: null,
      value: null
    });
  };
  
  // 删除筛选条件
  const removeFilter = (optionId: string) => {
    if (disabled) return;
    const newFilters = appliedFilters.filter(filter => filter.optionId !== optionId);
    handleFilterChange(newFilters);
  };
  
  // 重置所有筛选条件（使用 React Hook Form 的 reset 功能）
  const resetAllFilters = () => {
    if (disabled) return;
    reset({
      filters: [],
      currentFilter: {
        optionId: null,
        value: null
      }
    });
    onChange?.([]);
  };

  // 选择筛选项
  const handleSelectFilterOption = (option: FilterOption) => {
    if (disabled) return;
    setValue('currentFilter.optionId', option.id);
    setValue('currentFilter.value', null);
  };

  // 处理输入框点击
  const handleInputClick = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  // 渲染筛选项的筛选方法
  const renderFilterMethod = () => {
    if (!selectedOption) return null;

    switch (selectedOption.type) {
      case 'select':
        return (
          <Select 
            disabled={disabled}
            onValueChange={(value) => {
              if (disabled || !selectedOption.options) return;
              const selectedOptionItem = selectedOption.options.find(opt => opt.value.toString() === value);
              if (!selectedOptionItem) return;
              
              addFilter({
                optionId: selectedOption.id,
                label: selectedOption.label,
                value: selectedOptionItem.value,
                displayValue: selectedOptionItem.label
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`选择${selectedOption.label}`} />
            </SelectTrigger>
            <SelectContent>
              {selectedOption.options?.map((option) => (
                <SelectItem key={option.value.toString()} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'input':
        return (
          <div className="flex gap-2">
            <Controller
              name="currentFilter.value"
              control={control}
              render={({ field }) => (
                <Input 
                  placeholder={`输入${selectedOption.label}`}
                  value={field.value as string || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={disabled}
                />
              )}
            />
            <Button 
              onClick={() => {
                if (disabled) return;
                const value = getValues('currentFilter.value');
                if (!value) return;
                addFilter({
                  optionId: selectedOption.id,
                  label: selectedOption.label,
                  value,
                  displayValue: value as string
                });
              }}
              disabled={disabled}
            >
              确定
            </Button>
          </div>
        );
      
      case 'date':
        return (
          <div className="flex flex-col gap-2">
            <Popover open={disabled ? false : datePickerOpen} onOpenChange={disabled ? () => {} : setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentFilterValue ? (
                    format(currentFilterValue as Date, 'yyyy-MM-dd', { locale: zhCN })
                  ) : (
                    <span>选择日期</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Controller
                  name="currentFilter.value"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      mode="single"
                      selected={field.value as Date | undefined}
                      onSelect={(date) => {
                        setDatePickerOpen(false);
                        if (!date) return;
                        field.onChange(date);
                      }}
                      disabled={disabled}
                    />
                  )}
                />
              </PopoverContent>
            </Popover>
            <Button 
              onClick={() => {
                if (disabled) return;
                const value = getValues('currentFilter.value');
                if (!value) return;
                addFilter({
                  optionId: selectedOption.id,
                  label: selectedOption.label,
                  value,
                  displayValue: format(value as Date, 'yyyy-MM-dd', { locale: zhCN })
                });
              }}
              disabled={disabled}
            >
              确定
            </Button>
          </div>
        );
      
      case 'dateRange':
        // 日期范围筛选将在后续实现
        return <div>日期范围筛选 - 开发中</div>;
      
      case 'custom':
        return selectedOption.renderCustomFilter?.({
          onChange: (value) => {
            if (disabled) return;
            setValue('currentFilter.value', value);
          },
          value: currentFilterValue,
          disabled
        });
      
      default:
        return <div>暂不支持的筛选类型</div>;
    }
  };

  return (
    <div className={`multiple-filter ${className}`}>
      <div className="flex flex-col space-y-2">
        {/* 搜索输入框 */}
        <div className="relative flex-1">
          <Popover open={disabled ? false : isOpen} onOpenChange={disabled ? () => {} : setIsOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  type="text"
                  placeholder={placeholder}
                  className={cn("pr-10 w-full", disabled && "cursor-not-allowed opacity-70")}
                  readOnly
                  onClick={handleInputClick}
                  disabled={disabled}
                />
                <Search className={cn("absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4", disabled ? "text-gray-300" : "text-gray-400")} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]" align="start" sideOffset={5}>
              {!selectedOption ? (
                <Command>
                  <CommandInput placeholder="搜索筛选条件..." />
                  <CommandList>
                    <CommandEmpty>未找到筛选条件</CommandEmpty>
                    <CommandGroup>
                      {filterOptions.map((option) => (
                        <CommandItem
                          key={option.id}
                          onSelect={() => handleSelectFilterOption(option)}
                          disabled={disabled}
                        >
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              ) : (
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{selectedOption.label}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (disabled) return;
                        setValue('currentFilter.optionId', null);
                      }}
                      disabled={disabled}
                    >
                      返回
                    </Button>
                  </div>
                  {renderFilterMethod()}
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        
        {/* 已应用的筛选条件标签 */}
        {appliedFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {appliedFilters.map((filter) => (
              <Badge 
                key={`${filter.optionId}-${String(filter.value)}`} 
                variant="secondary" 
                className={cn("px-2 py-1", disabled && "opacity-70")}
              >
                <span>
                  {filter.label}: {filter.displayValue}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-4 w-4 p-0 ml-1", disabled && "cursor-not-allowed")}
                  onClick={() => removeFilter(filter.optionId)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">删除筛选条件</span>
                </Button>
              </Badge>
            ))}
            
            {appliedFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
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
  );
};

export default MultipleFilter;
