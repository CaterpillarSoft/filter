import type { TableProps } from 'antd'
import { Pagination, Table } from 'antd'
import { useState } from 'react'

function TableComponent<RecordType extends Record<string, any>>(props: TableProps<RecordType>) {
  const { columns, dataSource } = props
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const paginatedData = dataSource?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )
  return (
    <div style={{ position: 'relative' }}>
      <Table<RecordType> columns={columns} dataSource={paginatedData} pagination={false} />
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: '#fff',
          padding: '12px 16px',
          display: 'flex', // 新增
          justifyContent: 'flex-end', // 右对齐
          zIndex: 10, // 确保不被遮挡（可选）
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={dataSource?.length}
          showSizeChanger
          onChange={(page, size) => {
            setCurrentPage(page)
            setPageSize(size)
          }}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        />
      </div>
    </div>
  )
}

export default TableComponent
