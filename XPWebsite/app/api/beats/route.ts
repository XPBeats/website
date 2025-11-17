import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filters
    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre')
    const bpmMin = searchParams.get('bpmMin')
    const bpmMax = searchParams.get('bpmMax')
    const key = searchParams.get('key')
    const mood = searchParams.get('mood')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { genre: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ]
    }

    if (genre && genre !== 'all') {
      where.genre = { equals: genre, mode: 'insensitive' }
    }

    if (key && key !== 'all') {
      where.key = { equals: key, mode: 'insensitive' }
    }

    if (mood && mood !== 'all') {
      where.mood = { equals: mood, mode: 'insensitive' }
    }

    if (bpmMin || bpmMax) {
      where.bpm = {}
      if (bpmMin) where.bpm.gte = parseInt(bpmMin)
      if (bpmMax) where.bpm.lte = parseInt(bpmMax)
    }

    if (priceMin || priceMax) {
      const priceFilter: any = {}
      if (priceMin) priceFilter.gte = parseFloat(priceMin)
      if (priceMax) priceFilter.lte = parseFloat(priceMax)
      
      where.OR = [
        { basicPrice: priceFilter },
        { premiumPrice: priceFilter },
        { unlimitedPrice: priceFilter },
        { exclusivePrice: priceFilter },
      ]
    }

    // Build orderBy
    let orderBy: any = {}
    switch (sortBy) {
      case 'popular':
        orderBy = { plays: 'desc' }
        break
      case 'price_low':
        orderBy = { basicPrice: 'asc' }
        break
      case 'price_high':
        orderBy = { basicPrice: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    const beats = await prisma.beat.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        slug: true,
        genre: true,
        bpm: true,
        key: true,
        mood: true,
        tags: true,
        basicPrice: true,
        premiumPrice: true,
        unlimitedPrice: true,
        exclusivePrice: true,
        coverImageUrl: true,
        previewUrl: true,
        isFeatured: true,
        isFree: true,
        plays: true,
        createdAt: true,
      },
    })

    return NextResponse.json(beats)
  } catch (error) {
    console.error('Error fetching beats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch beats' },
      { status: 500 }
    )
  }
}