import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscriber = await prisma.emailSubscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 400 }
        )
      } else {
        // Reactivate existing subscriber
        await prisma.emailSubscriber.update({
          where: { email },
          data: { isActive: true },
        })
        return NextResponse.json({ success: true })
      }
    }

    // Create new subscriber
    await prisma.emailSubscriber.create({
      data: {
        email,
        name,
        source: source || 'website',
      },
    })

    // TODO: Send welcome email with free beat pack
    // TODO: Add to email marketing platform (Mailchimp, ConvertKit, etc.)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}