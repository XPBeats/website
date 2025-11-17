'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeatFilters {
  search: string
  genre: string
  bpmRange: [number, number]
  key: string
  mood: string
  priceRange: [number, number]
  sortBy: 'newest' | 'popular' | 'price_low' | 'price_high'
}

interface BeatFiltersProps {
  filters: BeatFilters
  onFiltersChange: (filters: Partial<BeatFilters>) => void
}

const genres = ['All', 'Trap', 'Hip Hop', 'R&B', 'Electronic', 'Ambient', 'Experimental']
const keys = ['All', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const moods = ['All', 'Dark', 'Energetic', 'Chill', 'Aggressive', 'Emotional', 'Atmospheric']

export function BeatFilters({ filters, onFiltersChange }: BeatFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search beats..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-3 bg-cyber-light border border-neon-green/20 rounded-lg focus:border-neon-green focus:ring-2 focus:ring-neon-green/20 text-white placeholder-gray-400"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {isOpen && <X className="w-4 h-4" />}
        </Button>

        <select
          value={filters.sortBy}
          onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
          className="bg-cyber-light border border-neon-green/20 rounded-lg px-4 py-2 text-white"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      {/* Expandable Filters */}
      {isOpen && (
        <div className="cyber-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Genre */}
            <div>
              <label className="block text-sm font-medium mb-2">Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => onFiltersChange({ genre: e.target.value })}
                className="w-full bg-cyber-light border border-neon-green/20 rounded-lg px-4 py-2 text-white"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre.toLowerCase()}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Key */}
            <div>
              <label className="block text-sm font-medium mb-2">Key</label>
              <select
                value={filters.key}
                onChange={(e) => onFiltersChange({ key: e.target.value })}
                className="w-full bg-cyber-light border border-neon-green/20 rounded-lg px-4 py-2 text-white"
              >
                {keys.map((key) => (
                  <option key={key} value={key.toLowerCase()}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium mb-2">Mood</label>
              <select
                value={filters.mood}
                onChange={(e) => onFiltersChange({ mood: e.target.value })}
                className="w-full bg-cyber-light border border-neon-green/20 rounded-lg px-4 py-2 text-white"
              >
                {moods.map((mood) => (
                  <option key={mood} value={mood.toLowerCase()}>
                    {mood}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BPM Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              BPM Range: {filters.bpmRange[0]} - {filters.bpmRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="60"
                max="200"
                value={filters.bpmRange[0]}
                onChange={(e) => 
                  onFiltersChange({ 
                    bpmRange: [parseInt(e.target.value), filters.bpmRange[1]]
                  })
                }
                className="flex-1"
              />
              <input
                type="range"
                min="60"
                max="200"
                value={filters.bpmRange[1]}
                onChange={(e) => 
                  onFiltersChange({ 
                    bpmRange: [filters.bpmRange[0], parseInt(e.target.value)]
                  })
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="1000"
                step="5"
                value={filters.priceRange[0]}
                onChange={(e) => 
                  onFiltersChange({ 
                    priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                  })
                }
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="5"
                value={filters.priceRange[1]}
                onChange={(e) => 
                  onFiltersChange({ 
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                  })
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Reset Filters */}
          <div className="flex justify-end">
            <Button
              onClick={() => {
                onFiltersChange({
                  search: '',
                  genre: 'all',
                  bpmRange: [60, 200],
                  key: 'all',
                  mood: 'all',
                  priceRange: [0, 1000],
                  sortBy: 'newest',
                })
              }}
              variant="outline"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}