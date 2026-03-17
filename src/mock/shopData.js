export const categories = [
  { id: 1, name: '新鲜水果' },
  { id: 2, name: '休闲零食' },
  { id: 3, name: '粮油速食' },
  { id: 4, name: '数码配件' },
]

export const products = [
  {
    id: 101,
    category_id: 1,
    name: '云南蓝莓 125g',
    desc: '当日冷链发货，酸甜平衡，适合直接食用或搭配酸奶。',
    price: 19.9,
    stock: 280,
    image_url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80',
    sold_count: 1860,
    status: 'on',
  },
  {
    id: 102,
    category_id: 1,
    name: '海南贵妃芒 3斤装',
    desc: '果肉细腻、甜度高，支持坏果包赔。',
    price: 42,
    stock: 96,
    image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    sold_count: 932,
    status: 'on',
  },
  {
    id: 201,
    category_id: 2,
    name: '手工牛轧糖礼盒',
    desc: '低甜配方，含巴旦木与蔓越莓颗粒。',
    price: 39.5,
    stock: 120,
    image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=80',
    sold_count: 646,
    status: 'on',
  },
  {
    id: 202,
    category_id: 2,
    name: '海苔脆片组合装',
    desc: '独立小包，办公室与出行都方便。',
    price: 26.8,
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    sold_count: 1112,
    status: 'off',
  },
  {
    id: 301,
    category_id: 3,
    name: '东北珍珠米 5kg',
    desc: '新米上市，颗粒饱满，饭香浓郁。',
    price: 68,
    stock: 75,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    sold_count: 504,
    status: 'on',
  },
  {
    id: 401,
    category_id: 4,
    name: '65W 氮化镓快充头',
    desc: '支持 PD/PPS，多设备兼容，体积更小。',
    price: 99,
    stock: 310,
    image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    sold_count: 1722,
    status: 'on',
  },
]

export const users = [
  {
    id: 1,
    username: 'zhangsan',
    email: 'zhangsan@goshop.com',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: 'user',
    status: 'active',
    created_at: '2026-01-09 10:20',
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@goshop.com',
    avatar: 'https://i.pravatar.cc/150?img=33',
    role: 'admin',
    status: 'active',
    created_at: '2025-12-18 09:00',
  },
  {
    id: 3,
    username: 'lihua',
    email: 'lihua@goshop.com',
    avatar: 'https://i.pravatar.cc/150?img=47',
    role: 'user',
    status: 'disabled',
    created_at: '2026-02-02 16:08',
  },
]

export const orders = [
  {
    id: 9001,
    user_id: 1,
    total_amount: 138.9,
    status: 'pending',
    receiver_addr: '深圳市南山区科苑路 1001 号',
    receiver_name: '张三',
    receiver_phone: '13800138000',
    remark: '工作日 18:00 后配送',
    created_at: '2026-03-15 12:06',
    items: [
      { id: 1, order_id: 9001, product_id: 101, quantity: 2 },
      { id: 2, order_id: 9001, product_id: 401, quantity: 1 },
    ],
  },
  {
    id: 9002,
    user_id: 3,
    total_amount: 78,
    status: 'paid',
    receiver_addr: '广州市天河区体育东路 88 号',
    receiver_name: '李华',
    receiver_phone: '13900139000',
    remark: '',
    created_at: '2026-03-13 09:24',
    items: [
      { id: 3, order_id: 9002, product_id: 301, quantity: 1 },
      { id: 4, order_id: 9002, product_id: 201, quantity: 1 },
    ],
  },
  {
    id: 9003,
    user_id: 1,
    total_amount: 42,
    status: 'completed',
    receiver_addr: '深圳市宝安区创业一路 200 号',
    receiver_name: '张三',
    receiver_phone: '13800138000',
    remark: '请放快递柜',
    created_at: '2026-03-10 15:11',
    items: [{ id: 5, order_id: 9003, product_id: 102, quantity: 1 }],
  },
]

const categoryMap = categories.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {})

const productMap = products.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {})

const userMap = users.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {})

export const productsWithCategory = products.map((item) => ({
  ...item,
  category: categoryMap[item.category_id] || null,
}))

export const ordersWithRelations = orders.map((order) => ({
  ...order,
  user: userMap[order.user_id] || null,
  items: order.items.map((item) => ({
    ...item,
    product: productMap[item.product_id] || null,
  })),
}))

export const dashboardStats = {
  categoryCount: categories.length,
  productCount: products.length,
  activeUserCount: users.filter((item) => item.status === 'active').length,
  orderCount: orders.length,
  gmv: orders.reduce((sum, item) => sum + item.total_amount, 0),
}
