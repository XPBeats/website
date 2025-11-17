import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { cartItems } = await request.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate cart items and get beat data
    const validatedItems = []
    let totalAmount = 0

    for (const item of cartItems) {
      const beat = await prisma.beat.findUnique({
        where: { id: item.beatId },
        select: {
          id: true,
          title: true,
          slug: true,
          basicPrice: true,
          premiumPrice: true,
          unlimitedPrice: true,
          exclusivePrice: true,
          basicFileUrl: true,
          premiumFileUrl: true,
          unlimitedFileUrl: true,
          exclusiveFileUrl: true,
        },
      })

      if (!beat) {
        return NextResponse.json(
          { error: `Beat not found: ${item.beatId}` },
          { status: 400 }
        )
      }

      const priceMap = {
        BASIC: beat.basicPrice,
        PREMIUM: beat.premiumPrice,
        UNLIMITED: beat.unlimitedPrice,
        EXCLUSIVE: beat.exclusivePrice,
      }

      const price = priceMap[item.licenseType as keyof typeof priceMap]
      if (price === undefined) {
        return NextResponse.json(
          { error: `Invalid license type: ${item.licenseType}` },
          { status: 400 }
        )
      }

      validatedItems.push({
        beat,
        licenseType: item.licenseType,
        price,
      })

      totalAmount += price * 100 // Convert to cents
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: totalAmount / 100,
        status: 'PENDING',
        customerEmail: session.user.email!,
        customerName: session.user.name,
        items: {
          create: validatedItems.map(item => ({
            beatId: item.beat.id,
            licenseType: item.licenseType,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            beat: true,
          },
        },
      },
    })

    // Create Stripe checkout session
    const lineItems = validatedItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.beat.title} - ${item.licenseType} License`,
          description: `Premium beat license for ${item.beat.title}`,
          metadata: {
            beatId: item.beat.id,
            licenseType: item.licenseType,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    }))

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: session.user.email!,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
      billing_address_collection: 'auto',
      payment_intent_data: {
        metadata: {
          orderId: order.id,
        },
      },
    })

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    })

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}