import { BeatCard } from '@/components/beats/beat-card'
import { prisma } from '@/lib/db'

export async function FeaturedBeats() {
  const featuredBeats = await prisma.beat.findMany({
    where: {
      isFeatured: true,
      isActive: true,
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
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
    },
  })

  if (featuredBeats.length === 0) {
    return null
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-cyber font-bold mb-4">
            Featured <span className="text-neon-green glow-text">Beats</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Hand-picked premium beats that showcase the best of our cyberpunk collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredBeats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      </div>
    </section>
  )
}