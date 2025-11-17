'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Download, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-green rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Scanline Effect */}
      <div className="scanline" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-cyber font-black mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            XP
            <span className="text-neon-green glow-text animate-glow">BEATS</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-2 font-mono"
          >
            PREMIUM CYBERPUNK INSTRUMENTALS
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Futuristic beats crafted for artists who demand excellence. 
            Dark atmospheres, cutting-edge sound design, and commercial-ready production.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/beats">
              <Button size="lg" className="cyber-button group text-lg px-8 py-6">
                <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                EXPLORE BEATS
              </Button>
            </Link>
            
            <Link href="/free">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 text-lg px-8 py-6"
              >
                <Download className="w-5 h-5 mr-2" />
                FREE DOWNLOADS
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl font-cyber font-bold text-neon-green">500+</div>
              <div className="text-sm text-gray-400">Premium Beats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-cyber font-bold text-neon-blue">10K+</div>
              <div className="text-sm text-gray-400">Happy Artists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-cyber font-bold text-neon-purple">24/7</div>
              <div className="text-sm text-gray-400">Instant Download</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Action */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-8 h-8 border-2 border-neon-green rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-neon-green" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}