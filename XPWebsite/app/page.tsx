import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/home/hero'
import { FeaturedBeats } from '@/components/home/featured-beats'
import { BeatGrid } from '@/components/beats/beat-grid'
import { Newsletter } from '@/components/home/newsletter'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { BackgroundEffects } from '@/components/ui/background-effects'

export default function HomePage() {
  return (
    <main className="min-h-screen relative">
      <BackgroundEffects />
      <Header />
      
      <Hero />
      
      <section className="container mx-auto px-4 py-16 space-y-16">
        <Suspense fallback={<div>Loading featured beats...</div>}>
          <FeaturedBeats />
        </Suspense>
        
        <Suspense fallback={<div>Loading beat library...</div>}>
          <BeatGrid />
        </Suspense>
        
        <Newsletter />
      </section>
      
      <Footer />
      <CartDrawer />
    </main>
  )
}