import type { AppliedFilter, FilterOption } from '@caterpillarsoft/filter'
import { MultipleFilter } from '@caterpillarsoft/filter'
import { Table } from 'antd'
import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from './mock'

const exampleFilterOptions: FilterOption[] = [
  {
    id: 'name',
    label: '实例名称',
    type: 'input',
  },
  {
    id: 'status',
    label: '状态',
    type: 'select',
    multiple: true,
    options: [
      { value: 'running', label: '运行中' },
      { value: 'stopped', label: '已停止' },
      { value: 'deleting', label: '删除中' },
      { value: 'restarting', label: '重启中' },
    ],
  },
  {
    id: 'ip',
    label: '主私网IP地址',
    type: 'input',
  },
  {
    id: 'publicIp',
    label: '公网IP地址',
    type: 'input',
  },
  {
    id: 'rdmaIp',
    label: 'RDMA IP地址',
    type: 'input',
  },
  {
    id: 'createDate',
    label: '创建日期',
    type: 'date',
  },
  {
    id: 'updateDate',
    label: '更新时间范围',
    type: 'dateRange',
  },
  {
    id: 'instanceType',
    label: '实例规格',
    type: 'select',
    options: [
      { value: 'small', label: '小型' },
      { value: 'medium', label: '中型' },
      { value: 'large', label: '大型' },
    ],
  },
  {
    id: 'instanceFamily',
    label: '实例规格族',
    type: 'select',
    options: [
      { value: 'g1', label: 'G1' },
      { value: 'g2', label: 'G2' },
      { value: 'c1', label: 'C1' },
      { value: 'm1', label: 'M1' },
      { value: 'r1', label: 'R1' },
    ],
  },
  {
    id: 'vpcId',
    label: 'VPC ID',
    type: 'input',
  },
  {
    id: 'zone',
    label: '可用区',
    type: 'select',
    options: [
      { value: 'zone-a', label: '可用区A' },
      { value: 'zone-b', label: '可用区B' },
      { value: 'zone-c', label: '可用区C' },
      { value: 'zone-d', label: '可用区D' },
    ],
  },
]

// 初始筛选条件
const initialFilters: AppliedFilter[] = [
  {
    optionId: 'status',
    label: '状态',
    value: 'running',
    displayValue: '运行中',
  },
  {
    optionId: 'zone',
    label: '可用区',
    value: 'zone-a',
    displayValue: '可用区A',
  },
]

function App() {
  const [filters, setFilters] = useState<AppliedFilter[]>(initialFilters)
  const { data: instances, isLoading } = useSWR('/api/instances', fetcher)
  const [disabled, setDisabled] = useState(false)

  // 根据筛选条件过滤数据
  const filteredInstances = instances?.filter((instance) => {
    return filters.every((filter) => {
      const filterValue = filter.value
      if (filterValue === null)
        return true

      switch (filter.optionId) {
        case 'name':
          return typeof filterValue === 'string' && instance.name.toLowerCase().includes(filterValue.toLowerCase())
        case 'status':
          return instance.status === filterValue
        case 'ip':
          return typeof filterValue === 'string' && instance.ip.includes(filterValue)
        case 'publicIp':
          return typeof filterValue === 'string' && instance.publicIp.includes(filterValue)
        case 'rdmaIp':
          return typeof filterValue === 'string' && instance.rdmaIp.includes(filterValue)
        case 'instanceType':
          return instance.instanceType === filterValue
        case 'instanceFamily':
          return instance.instanceFamily === filterValue
        case 'vpcId':
          return typeof filterValue === 'string' && instance.vpcId.includes(filterValue)
        case 'zone':
          return instance.zone === filterValue
        default:
          return true
      }
    })
  }) || []

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: '公网IP', dataIndex: 'publicIp', key: 'publicIp' },
    { title: '可用区', dataIndex: 'zone', key: 'zone' },
    { title: '实例规格', dataIndex: 'instanceType', key: 'instanceType' },
  ]

  const handleFilterChange = (newFilters: AppliedFilter[]) => {
    setFilters(newFilters)
  }

  const toggleDisabled = () => {
    setDisabled(!disabled)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">多重筛选条件组件示例</h1>

      <div className="mb-4 flex gap-4">
        <button onClick={toggleDisabled}>
          {disabled ? '启用筛选器' : '禁用筛选器'}
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">基本使用</h2>
        <div className="border p-4 rounded-md">
          <MultipleFilter
            filterOptions={exampleFilterOptions}
            initialFilters={initialFilters}
            onChange={handleFilterChange}
            placeholder="请添加筛选条件"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">数据状态</h2>
        <div className="border p-4 rounded-md">
          {isLoading
            ? (
                <p className="text-blue-500">加载中...</p>
              )
            : (
                <div>
                  <p className="text-green-600 mb-2">数据加载成功</p>
                  <p>
                    总数据量:
                    {instances?.length || 0}
                  </p>
                  <p>
                    筛选后数据量:
                    {filteredInstances.length}
                  </p>
                </div>
              )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">当前筛选条件</h2>
        <div className="border p-4 rounded-md">
          {filters.length > 0
            ? (
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(filters, null, 2)}
                </pre>
              )
            : (
                <p className="text-gray-500">暂无筛选条件</p>
              )}
        </div>
      </div>

      <div className="mb-8">
        <Table
          dataSource={filteredInstances}
          loading={isLoading}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>
    </div>
  )
}

export default App
