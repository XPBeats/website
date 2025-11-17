import { PrismaClient, LicenseType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const sampleBeats = [
  {
    title: "Neon Dreams",
    slug: "neon-dreams",
    description: "Dark cyberpunk beat with heavy 808s and atmospheric synths. Perfect for trap and hip-hop artists.",
    genre: "Trap",
    bpm: 140,
    key: "A Minor",
    mood: "Dark",
    tags: ["cyberpunk", "trap", "808", "dark", "atmospheric"],
    basicPrice: 30.00,
    premiumPrice: 60.00,
    unlimitedPrice: 150.00,
    exclusivePrice: 750.00,
    isFeatured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop",
    previewUrl: "https://example.com/previews/neon-dreams.mp3", // Replace with actual UploadThing URLs
    basicFileUrl: "https://example.com/beats/neon-dreams-basic.mp3",
    premiumFileUrl: "https://example.com/beats/neon-dreams-premium.wav",
    unlimitedFileUrl: "https://example.com/beats/neon-dreams-unlimited.zip",
    exclusiveFileUrl: "https://example.com/beats/neon-dreams-exclusive.zip",
  },
  {
    title: "Digital Phantom",
    slug: "digital-phantom",
    description: "Futuristic melody with glitchy elements and hard-hitting drums. Experimental yet commercial.",
    genre: "Electronic",
    bpm: 128,
    key: "F# Minor", 
    mood: "Energetic",
    tags: ["futuristic", "glitch", "electronic", "experimental"],
    basicPrice: 25.00,
    premiumPrice: 50.00,
    unlimitedPrice: 125.00,
    exclusivePrice: 600.00,
    isFeatured: false,
    coverImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop",
    previewUrl: "https://example.com/previews/digital-phantom.mp3",
    basicFileUrl: "https://example.com/beats/digital-phantom-basic.mp3",
    premiumFileUrl: "https://example.com/beats/digital-phantom-premium.wav",
    unlimitedFileUrl: "https://example.com/beats/digital-phantom-unlimited.zip",
    exclusiveFileUrl: "https://example.com/beats/digital-phantom-exclusive.zip",
  },
  {
    title: "Free Sample Pack",
    slug: "free-sample-pack",
    description: "High-quality sample pack featuring 10 one-shots and 5 loops. Perfect for producers getting started.",
    genre: "Sample Pack",
    bpm: 0, // Not applicable for sample packs
    key: "Various",
    mood: "Versatile",
    tags: ["free", "samples", "loops", "one-shots"],
    basicPrice: 0.00,
    premiumPrice: 0.00,
    unlimitedPrice: 0.00,
    exclusivePrice: 0.00,
    isFeatured: true,
    isFree: true,
    coverImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
    previewUrl: "https://example.com/previews/free-sample-pack.mp3",
    basicFileUrl: "https://example.com/beats/free-sample-pack.zip",
    premiumFileUrl: "https://example.com/beats/free-sample-pack.zip",
    unlimitedFileUrl: "https://example.com/beats/free-sample-pack.zip",
    exclusiveFileUrl: "https://example.com/beats/free-sample-pack.zip",
  }
]

async function main() {
  console.log('🌱 Seeding database...')
  
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@xpbeats.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@xpbeats.com',
      name: 'XP Beats Admin',
      role: 'ADMIN',
    }
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create sample beats
  for (const beatData of sampleBeats) {
    const beat = await prisma.beat.upsert({
      where: { slug: beatData.slug },
      update: {},
      create: beatData,
    })
    console.log(`✅ Created beat: ${beat.title}`)
  }

  // Create sample coupons
  const coupons = [
    {
      code: 'WELCOME10',
      description: '10% off your first purchase',
      isPercentage: true,
      value: 10,
      maxUses: 100,
    },
    {
      code: 'SAVE20',
      description: '$20 off orders over $100',
      isPercentage: false,
      value: 20,
      maxUses: 50,
    }
  ]

  for (const couponData of coupons) {
    const coupon = await prisma.coupon.upsert({
      where: { code: couponData.code },
      update: {},
      create: couponData,
    })
    console.log(`✅ Created coupon: ${coupon.code}`)
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })