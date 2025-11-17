'use client'

import { useState } from 'react'
import { BeatCard } from './beat-card'
import { BeatFilters } from './beat-filters'
import { useQuery } from '@tanstack/react-query'

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

interface BeatFilters {
  search: string
  genre: string
  bpmRange: [number, number]
  key: string
  mood: string
  priceRange: [number, number]
  sortBy: 'newest' | 'popular' | 'price_low' | 'price_high'
}

async function fetchBeats(filters: BeatFilters): Promise<Beat[]> {
  const params = new URLSearchParams()
  
  if (filters.search) params.set('search', filters.search)
  if (filters.genre && filters.genre !== 'all') params.set('genre', filters.genre)
  if (filters.key && filters.key !== 'all') params.set('key', filters.key)
  if (filters.mood && filters.mood !== 'all') params.set('mood', filters.mood)
  if (filters.bpmRange[0] > 60) params.set('bpmMin', filters.bpmRange[0].toString())
  if (filters.bpmRange[1] < 200) params.set('bpmMax', filters.bpmRange[1].toString())
  if (filters.priceRange[0] > 0) params.set('priceMin', filters.priceRange[0].toString())
  if (filters.priceRange[1] < 1000) params.set('priceMax', filters.priceRange[1].toString())
  params.set('sortBy', filters.sortBy)

  const response = await fetch(`/api/beats?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch beats')
  }
  
  return response.json()
}

export function BeatGrid() {
  const [filters, setFilters] = useState<BeatFilters>({
    search: '',
    genre: 'all',
    bpmRange: [60, 200],
    key: 'all',
    mood: 'all',
    priceRange: [0, 1000],
    sortBy: 'newest',
  })

  const { data: beats = [], isLoading, error } = useQuery({
    queryKey: ['beats', filters],
    queryFn: () => fetchBeats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleFiltersChange = (newFilters: Partial<BeatFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Failed to load beats. Please try again.</p>
      </div>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-cyber font-bold mb-4">
            Beat <span className="text-neon-green glow-text">Library</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore our entire collection of premium cyberpunk beats. 
            Use the filters to find exactly what you need.
          </p>
        </div>

        <BeatFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="cyber-card h-80 animate-pulse">
                <div className="bg-cyber-light w-full h-48 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-cyber-light rounded w-3/4" />
                  <div className="h-3 bg-cyber-light rounded w-1/2" />
                  <div className="h-6 bg-cyber-light rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : beats.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              No beats found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {beats.map((beat) => (
              <BeatCard 
                key={beat.id} 
                beat={beat}
              />
            ))}
          </div>
        )}

        {beats.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400">
              Showing {beats.length} beat{beats.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}