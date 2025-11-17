'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, ShoppingCart, Download, Music, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LicenseType } from '@prisma/client'
import { toast } from 'sonner'

interface Beat {
  id: string
  title: string
  slug: string
  genre: string
  bpm: number
  key?: string
  mood?: string
  tags: string[]
  basicPrice: number
  premiumPrice: number
  unlimitedPrice: number
  exclusivePrice: number
  coverImageUrl?: string
  previewUrl: string
  isFeatured: boolean
  isFree: boolean
  plays: number
}

interface BeatCardProps {
  beat: Beat
}

export function BeatCard({ beat }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { addItem } = useCartStore()

  const handlePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        await audioRef.current.play()
        setIsPlaying(true)
        // Update play count
        fetch(`/api/beats/${beat.id}/play`, { method: 'POST' })
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      toast.error('Failed to play audio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (licenseType: LicenseType) => {
    const prices = {
      BASIC: beat.basicPrice,
      PREMIUM: beat.premiumPrice,
      UNLIMITED: beat.unlimitedPrice,
      EXCLUSIVE: beat.exclusivePrice,
    }

    addItem({
      beatId: beat.id,
      title: beat.title,
      licenseType,
      price: prices[licenseType],
      coverImageUrl: beat.coverImageUrl,
      slug: beat.slug,
    })

    toast.success(`Added ${beat.title} (${licenseType}) to cart`)
  }

  const handleFreeDownload = async () => {
    if (!beat.isFree) return

    try {
      const response = await fetch(`/api/beats/${beat.id}/download-free`, {
        method: 'POST',
      })

      if (response.ok) {
        const { downloadUrl } = await response.json()
        window.open(downloadUrl, '_blank')
        toast.success('Download started!')
      } else {
        toast.error('Failed to start download')
      }
    } catch (error) {
      toast.error('Failed to start download')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="cyber-card group hover:scale-105 transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 bg-cyber-light">
          {beat.coverImageUrl ? (
            <Image
              src={beat.coverImageUrl}
              alt={beat.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-16 h-16 text-neon-green/50" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="w-16 h-16 rounded-full bg-neon-green/20 hover:bg-neon-green/30 border-2 border-neon-green text-neon-green"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
          </div>

          {/* Tags */}
          <div className="absolute top-2 left-2 flex gap-1">
            {beat.isFeatured && (
              <span className="px-2 py-1 bg-neon-green text-cyber-dark text-xs font-bold rounded">
                FEATURED
              </span>
            )}
            {beat.isFree && (
              <span className="px-2 py-1 bg-neon-blue text-cyber-dark text-xs font-bold rounded">
                FREE
              </span>
            )}
          </div>

          {/* Genre */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-cyber-dark/80 text-neon-green text-xs font-mono rounded">
              {beat.genre}
            </span>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={beat.previewUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false)
            setIsLoading(false)
          }}
        />

        {/* Beat Info */}
        <div className="p-4">
          <Link href={`/beats/${beat.slug}`}>
            <h3 className="text-lg font-semibold mb-2 hover:text-neon-green transition-colors line-clamp-1">
              {beat.title}
            </h3>
          </Link>

          {/* Beat Details */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <span>{beat.bpm} BPM</span>
            {beat.key && <span>{beat.key}</span>}
            {beat.mood && <span>{beat.mood}</span>
          </div>

          {/* Price and Actions */}
          {beat.isFree ? (
            <Button
              onClick={handleFreeDownload}
              className="w-full cyber-button"
            >
              <Download className="w-4 h-4 mr-2" />
              FREE DOWNLOAD
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-neon-green">
                  {formatPrice(beat.basicPrice)}
                </span>
                <span className="text-sm text-gray-400">Basic License</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddToCart(LicenseType.BASIC)}
                  size="sm"
                  className="flex-1 cyber-button"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  ADD TO CART
                </Button>
                
                <Link href={`/beats/${beat.slug}`}>
                  <Button variant="outline" size="sm">
                    <Zap className="w-3 h-3" />
                  </Button>
                </Link>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Premium: {formatPrice(beat.premiumPrice)} | 
                Unlimited: {formatPrice(beat.unlimitedPrice)}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-cyber-light">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Play className="w-3 h-3" />
              {beat.plays.toLocaleString()}
            </div>
            <div className="flex gap-1">
              {beat.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-cyber-light text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}