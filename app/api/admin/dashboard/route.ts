import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get total revenue (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const revenueResult = await prisma.order.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { total: true },
      _count: true,
    })

    // Get total customers
    const totalCustomers = await prisma.user.count({
      where: { role: 'USER' },
    })

    // Get total beats
    const totalBeats = await prisma.beat.count({
      where: { isActive: true },
    })

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        items: {
          include: {
            beat: { select: { title: true } },
          },
        },
      },
    })

    // Get top performing beats
    const topBeats = await prisma.beat.findMany({
      orderBy: [
        { plays: 'desc' },
        { downloads: 'desc' },
      ],
      take: 5,
      select: {
        id: true,
        title: true,
        plays: true,
        downloads: true,
      },
    })

    return NextResponse.json({
      totalRevenue: revenueResult._sum.total || 0,
      totalSales: revenueResult._count || 0,
      totalCustomers,
      totalBeats,
      recentOrders,
      topBeats,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}