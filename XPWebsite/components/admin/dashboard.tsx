'use client'

import { useQuery } from '@tanstack/react-query'
import { 
  TrendingUp, 
  Music, 
  Users, 
  DollarSign,
  ShoppingCart,
  Download
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface DashboardStats {
  totalRevenue: number
  totalSales: number
  totalCustomers: number
  totalBeats: number
  recentOrders: Array<{
    id: string
    customerEmail: string
    total: number
    createdAt: string
    items: Array<{
      beat: { title: string }
      licenseType: string
    }>
  }>
  topBeats: Array<{
    id: string
    title: string
    plays: number
    downloads: number
  }>
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('/api/admin/dashboard')
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats')
  }
  return response.json()
}

export function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-cyber font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="cyber-card h-32 animate-pulse">
              <div className="bg-cyber-light w-full h-full rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Failed to load dashboard data</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-neon-green',
    },
    {
      title: 'Total Sales',
      value: stats?.totalSales || 0,
      icon: ShoppingCart,
      color: 'text-neon-blue',
    },
    {
      title: 'Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-neon-purple',
    },
    {
      title: 'Beat Library',
      value: stats?.totalBeats || 0,
      icon: Music,
      color: 'text-neon-orange',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-cyber font-bold">
          Admin <span className="text-neon-green glow-text">Dashboard</span>
        </h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="cyber-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-neon-green" />
            Recent Orders
          </h2>
          {stats?.recentOrders?.length === 0 ? (
            <p className="text-gray-400">No recent orders</p>
          ) : (
            <div className="space-y-4">
              {stats?.recentOrders?.map((order) => (
                <div key={order.id} className="border border-cyber-light rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{order.customerEmail}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-neon-green">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {order.items.map((item, idx) => (
                      <span key={idx}>
                        {item.beat.title} ({item.licenseType})
                        {idx < order.items.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Beats */}
        <div className="cyber-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon-blue" />
            Top Performing Beats
          </h2>
          {stats?.topBeats?.length === 0 ? (
            <p className="text-gray-400">No beat data available</p>
          ) : (
            <div className="space-y-4">
              {stats?.topBeats?.map((beat, index) => (
                <div key={beat.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{beat.title}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {beat.plays} plays
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {beat.downloads} downloads
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-neon-green">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}