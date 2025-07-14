import { useState } from 'react'
import './App.css'
import { MultipleFilter } from './components/multipleFilter'
import type { FilterOption, AppliedFilter } from './components/multipleFilter'

// 示例筛选选项
const exampleFilterOptions: FilterOption[] = [
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
      { value: 'stopped', label: '已停止' },
      { value: 'deleting', label: '删除中' },
      { value: 'restarting', label: '重启中' }
    ]
  },
  {
    id: 'ip',
    label: '主私网IP地址',
    type: 'input'
  },
  {
    id: 'publicIp',
    label: '公网IP地址',
    type: 'input'
  },
  {
    id: 'rdmaIp',
    label: 'RDMA IP地址',
    type: 'input'
  },
  {
    id: 'createDate',
    label: '创建日期',
    type: 'date'
  },
  {
    id: 'instanceType',
    label: '实例规格',
    type: 'select',
    options: [
      { value: 'small', label: '小型' },
      { value: 'medium', label: '中型' },
      { value: 'large', label: '大型' }
    ]
  },
  {
    id: 'instanceFamily',
    label: '实例规格族',
    type: 'select',
    options: [
      { value: 'g1', label: 'G1' },
      { value: 'g2', label: 'G2' },
      { value: 'c1', label: 'C1' }
    ]
  },
  {
    id: 'vpcId',
    label: 'VPC ID',
    type: 'input'
  },
  {
    id: 'zone',
    label: '可用区',
    type: 'select',
    options: [
      { value: 'zone-a', label: '可用区A' },
      { value: 'zone-b', label: '可用区B' },
      { value: 'zone-c', label: '可用区C' }
    ]
  }
];

function App() {
  const [filters, setFilters] = useState<AppliedFilter[]>([]);

  const handleFilterChange = (newFilters: AppliedFilter[]) => {
    setFilters(newFilters);
    console.log('筛选条件变化:', newFilters);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">多重筛选条件组件示例</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">基本使用</h2>
        <div className="border p-4 rounded-md">
          <MultipleFilter 
            filterOptions={exampleFilterOptions} 
            onChange={handleFilterChange}
            placeholder="请添加筛选条件"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">当前筛选条件</h2>
        <div className="border p-4 rounded-md">
          {filters.length > 0 ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(filters, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">暂无筛选条件</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
