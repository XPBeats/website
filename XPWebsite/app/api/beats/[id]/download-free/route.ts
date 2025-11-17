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
    const { email } = await request.json()

    // Find the beat
    const beat = await prisma.beat.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        isFree: true,
        basicFileUrl: true,
      },
    })

    if (!beat || !beat.isFree) {
      return NextResponse.json(
        { error: 'Beat not found or not free' },
        { status: 404 }
      )
    }

    // Capture email if provided
    if (email) {
      await prisma.emailSubscriber.upsert({
        where: { email },
        update: { isActive: true },
        create: {
          email,
          source: 'free_download',
        },
      })
    }

    // Increment download count
    await prisma.beat.update({
      where: { id: params.id },
      data: { downloads: { increment: 1 } },
    })

    // Generate signed download URL (implement based on your file storage)
    const downloadUrl = beat.basicFileUrl // In production, generate a signed URL

    return NextResponse.json({ 
      downloadUrl,
      message: 'Download started!' 
    })
  } catch (error) {
    console.error('Free download error:', error)
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    )
  }
}