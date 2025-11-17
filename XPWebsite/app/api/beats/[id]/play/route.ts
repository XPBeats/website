import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Params {
  id: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const beat = await prisma.beat.update({
      where: { id: params.id },
      data: {
        plays: { increment: 1 }
      }
    })

    return NextResponse.json({ success: true, plays: beat.plays })
  } catch (error) {
    console.error('Error updating play count:', error)
    return NextResponse.json(
      { error: 'Failed to update play count' },
      { status: 500 }
    )
  }
}