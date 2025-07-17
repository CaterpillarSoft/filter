// 生成大量模拟数据
function generateMockData() {
  const statuses = ['running', 'stopped', 'deleting', 'restarting']
  const instanceTypes = ['small', 'medium', 'large']
  const instanceFamilies = ['g1', 'g2', 'c1', 'm1', 'r1']
  const zones = ['zone-a', 'zone-b', 'zone-c', 'zone-d']
  const data = []

  for (let i = 1; i <= 200; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const instanceType = instanceTypes[Math.floor(Math.random() * instanceTypes.length)]
    const instanceFamily = instanceFamilies[Math.floor(Math.random() * instanceFamilies.length)]
    const zone = zones[Math.floor(Math.random() * zones.length)]

    // 生成随机IP地址
    const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    const publicIp = `203.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    const rdmaIp = `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

    // 生成随机日期
    const createDate = new Date(2024, 0, Math.floor(Math.random() * 365) + 1)
    const updateDate = new Date(createDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)

    data.push({
      id: i,
      name: `实例+${String(i).padStart(3, '0')}`,
      status,
      ip,
      publicIp,
      rdmaIp,
      createDate: createDate.toISOString().split('T')[0],
      updateDate: updateDate.toISOString().split('T')[0],
      instanceType,
      instanceFamily,
      vpcId: `vpc-${String(i).padStart(3, '0')}`,
      zone,
    })
  }

  return data
}

export const mockData = generateMockData()

// Fetcher 函数
export async function fetcher(url: string) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 根据 URL 参数返回不同的数据
  if (url.includes('/api/instances')) {
    return mockData
  }

  throw new Error('API endpoint not found')
}
