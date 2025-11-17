import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.metadata?.orderId) {
          // Update order status
          const order = await prisma.order.update({
            where: { id: session.metadata.orderId },
            data: { 
              status: 'COMPLETED',
              stripePaymentId: session.payment_intent as string,
            },
            include: {
              items: {
                include: {
                  beat: true,
                },
              },
              user: true,
            },
          })

          // Generate download URLs and update order items
          for (const item of order.items) {
            let downloadUrl: string
            
            switch (item.licenseType) {
              case 'BASIC':
                downloadUrl = item.beat.basicFileUrl
                break
              case 'PREMIUM':
                downloadUrl = item.beat.premiumFileUrl || item.beat.basicFileUrl
                break
              case 'UNLIMITED':
                downloadUrl = item.beat.unlimitedFileUrl || item.beat.premiumFileUrl || item.beat.basicFileUrl
                break
              case 'EXCLUSIVE':
                downloadUrl = item.beat.exclusiveFileUrl || item.beat.unlimitedFileUrl || item.beat.basicFileUrl
                break
              default:
                downloadUrl = item.beat.basicFileUrl
            }

            await prisma.orderItem.update({
              where: { id: item.id },
              data: { downloadUrl },
            })

            // Increment download count
            await prisma.beat.update({
              where: { id: item.beatId },
              data: { downloads: { increment: 1 } },
            })
          }

          // Send download email (implement this based on your email service)
          console.log(`Order ${order.id} completed for ${order.customerEmail}`)
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`Payment ${paymentIntent.id} succeeded`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}