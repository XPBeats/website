'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { Download, FileText, Clock, User, Mail } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackgroundEffects } from '@/components/ui/background-effects'

interface UserOrder {
  id: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    id: string
    licenseType: string
    price: number
    downloadUrl?: string
    beat: {
      title: string
      slug: string
      coverImageUrl?: string
    }
  }>
}

async function fetchUserOrders(): Promise<UserOrder[]> {
  const response = await fetch('/api/user/orders')
  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }
  return response.json()
}

export function UserDashboard() {
  const { data: session } = useSession()
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: fetchUserOrders,
    enabled: !!session?.user,
  })

  return (
    <div className="min-h-screen bg-cyber-dark relative">
      <BackgroundEffects />
      <Header />
      
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Welcome Section */}
          <div className="cyber-card p-8 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-cyber font-bold mb-2">
                  Welcome back, <span className="text-neon-green glow-text">{session?.user?.name?.split(' ')[0] || 'Artist'}</span>
                </h1>
                <p className="text-gray-400">Manage your beats and downloads</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {session?.user?.name}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Purchases</p>
                  <p className="text-2xl font-bold text-neon-green">
                    {orders.length}
                  </p>
                </div>
                <Download className="w-8 h-8 text-neon-green" />
              </div>
            </div>

            <div className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-neon-blue">
                    {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-neon-blue" />
              </div>
            </div>

            <div className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-2xl font-bold text-neon-purple">
                    {formatDate(new Date())}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-neon-purple" />
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="cyber-card p-8">
            <h2 className="text-2xl font-cyber font-bold mb-6">
              Your <span className="text-neon-green glow-text">Beats</span>
            </h2>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-cyber-light rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-cyber-light rounded w-1/3 mb-2" />
                    <div className="h-3 bg-cyber-light rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Download className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No beats purchased yet</h3>
                <p className="text-gray-400 mb-6">Start building your collection with our premium beats</p>
                <a
                  href="/beats"
                  className="inline-flex items-center px-6 py-3 bg-neon-green text-cyber-dark font-semibold rounded-lg hover:bg-neon-green/90 transition-colors"
                >
                  Browse Beats
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-cyber-light rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-400">
                          {formatDate(new Date(order.createdAt))} • {formatPrice(order.total)}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-neon-green/20 text-neon-green text-sm rounded-full">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-cyber-light rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-neon-green/20 rounded-lg flex items-center justify-center">
                              <Download className="w-6 h-6 text-neon-green" />
                            </div>
                            <div>
                              <p className="font-medium">{item.beat.title}</p>
                              <p className="text-sm text-gray-400">
                                {item.licenseType} License • {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>

                          {item.downloadUrl && (
                            <a
                              href={item.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-neon-green text-cyber-dark font-medium rounded-lg hover:bg-neon-green/90 transition-colors"
                            >
                              Download
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}