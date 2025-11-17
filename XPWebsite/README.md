# XP Beats - Premium Beat Store 🎵

A complete, production-ready beat selling platform built with Next.js 14, featuring a cyberpunk aesthetic and full e-commerce functionality.

![XP Beats](https://img.shields.io/badge/XP_Beats-Premium_Store-00ff41?style=for-the-badge&logo=music)

## ✨ Features

### 🏪 **Public Store**
- **Cyberpunk Design**: Dark theme with neon accents and animated backgrounds
- **Beat Preview**: 60-second waveform previews with play/pause controls  
- **Smart Filtering**: Search by genre, BPM, key, mood, and price range
- **License Tiers**: Basic ($30), Premium ($60), Unlimited ($150), Exclusive ($500+)
- **Free Downloads**: Email capture for marketing funnel
- **Mobile Responsive**: Optimized for all device sizes

### 🔐 **User Management**  
- **Multi-Auth**: Email/password + Google OAuth via NextAuth
- **User Dashboard**: View purchased beats and download files
- **License Management**: Automatic license PDF generation

### 🛒 **E-Commerce**
- **Shopping Cart**: Persistent cart with Zustand state management
- **Stripe Integration**: Secure checkout with webhook support
- **Instant Downloads**: Protected file URLs with expiration
- **Order Management**: Complete order tracking and history

### ⚡ **Admin Dashboard**
- **Analytics**: Revenue charts, sales metrics, customer insights
- **Beat Management**: Upload, edit, delete beats with file handling
- **Order Processing**: View all orders, customer details, download links
- **Coupon System**: Create percentage or fixed-amount discount codes
- **File Upload**: UploadThing integration for audio files and artwork
- **Payout Tracking**: Stripe balance and earnings overview

### 🎨 **Technical Excellence**
- **TypeScript**: Full type safety across the application
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: UploadThing for secure file uploads
- **Email**: Resend integration for transactional emails
- **Performance**: Optimized with React Query and proper caching
- **SEO Ready**: Open Graph tags and metadata optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- Stripe account
- UploadThing account  
- Google OAuth app (optional)
- Resend account (optional)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd xp-beats-store
npm install
```

### 2. Environment Setup

Copy the `.env.example` file:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://username:password@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://username:password@db.xxxxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# UploadThing
UPLOADTHING_SECRET="sk_live_your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Resend (Email)
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="beats@xpbeats.com"

# Admin Email
ADMIN_EMAIL="your-email@example.com"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="XP Beats"
```

### 3. Database Setup

#### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > Database 
3. Copy the Connection String and Direct Connection String
4. Update your `.env` file with these values

#### Option B: Railway PostgreSQL

1. Go to [railway.app](https://railway.app) and create a new project
2. Add a PostgreSQL service  
3. Copy the connection string from the Connect tab
4. Update your `.env` file

#### Option C: Local PostgreSQL

```bash
# Install PostgreSQL locally
# Create a new database
createdb xp_beats_db

# Update .env with local connection
DATABASE_URL="postgresql://username:password@localhost:5432/xp_beats_db"
DIRECT_URL="postgresql://username:password@localhost:5432/xp_beats_db"
```

### 4. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed with sample data
npm run db:seed
```

### 5. Stripe Configuration

1. **Create Stripe Account**: Go to [stripe.com](https://stripe.com) and sign up
2. **Get API Keys**: 
   - Dashboard > Developers > API keys
   - Copy Publishable key and Secret key to `.env`
3. **Set up Webhooks**:
   - Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy webhook secret to `.env`

### 6. UploadThing Setup

1. Go to [uploadthing.com](https://uploadthing.com) and create an account
2. Create a new app
3. Copy the App ID and Secret to your `.env` file
4. Configure file upload settings:
   - Max file size: 50MB (for audio files)
   - Allowed file types: `.mp3, .wav, .zip, .jpg, .png`

### 7. Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create credentials (OAuth 2.0 Client ID)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### 8. Email Setup (Optional)

1. Go to [resend.com](https://resend.com) and create an account  
2. Verify your domain or use their test domain
3. Create an API key
4. Add to `.env` file

### 9. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 10. Admin Access

- Navigate to `/admin`
- Sign in with credentials: `admin@xpbeats.com` / `admin123`
- Or use the admin email you set in `ADMIN_EMAIL`

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/xp-beats-store)

1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard  
3. Deploy!

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server  
npm run start
```

## 🎵 Adding Your First Beat

1. **Login to Admin**: Go to `/admin` and sign in
2. **Upload Files**: 
   - Cover image (JPG/PNG)
   - Preview audio (MP3, 60 seconds max)  
   - Full beat files (MP3/WAV for each license tier)
3. **Set Metadata**:
   - Title, genre, BPM, key, mood
   - Tags for discoverability
   - License prices
4. **Publish**: Toggle as featured/active

## 🔧 Customization

### Branding
- Update `NEXT_PUBLIC_APP_NAME` in `.env`
- Replace logo in `components/layout/header.tsx`
- Modify colors in `tailwind.config.js`

### License Types & Pricing  
- Edit in `prisma/schema.prisma`
- Update `LicenseType` enum
- Modify pricing logic in components

### Email Templates
- Customize in `lib/email-templates.ts`
- Update Resend templates

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: NextAuth with Google OAuth
- **Database**: PostgreSQL with Prisma ORM  
- **Payments**: Stripe Checkout + Webhooks
- **File Storage**: UploadThing
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **UI Components**: Radix UI + Shadcn/ui
- **Animations**: Framer Motion
- **Email**: Resend
- **Deployment**: Vercel

## 📄 License Types

| License | Price | Usage Rights |
|---------|-------|--------------|
| **Basic** | $30 | Non-profit use, up to 2,000 streams |
| **Premium** | $60 | Unlimited streams, radio play |  
| **Unlimited** | $150 | Music videos, unlimited distribution + stems |
| **Exclusive** | $500+ | Full ownership, trackouts, producer credit removal |

## 🔒 Security Features

- Protected API routes with authentication
- File access control with signed URLs
- Input validation with Zod
- CSRF protection
- Rate limiting on sensitive endpoints
- Secure session management

## 📧 Support

For questions or issues:

1. Check the [FAQ section](#) 
2. Open a GitHub issue
3. Contact: admin@xpbeats.com

## 🎉 What's Included

This repository includes:

- ✅ Complete Next.js 14 application
- ✅ Database schema with sample data
- ✅ Admin dashboard with full CRUD operations
- ✅ Stripe payment integration with webhooks
- ✅ File upload and management system  
- ✅ Email notification system
- ✅ Responsive cyberpunk UI
- ✅ SEO optimization
- ✅ Type-safe API routes
- ✅ Production deployment configuration

## 🚀 Production Tips

### Performance
- Enable Prisma Query Engine optimization
- Configure Redis for session storage
- Set up CDN for static assets
- Enable Next.js image optimization

### Security  
- Change default admin password
- Enable rate limiting
- Configure CORS properly
- Use environment-specific API keys
- Enable database connection pooling

### Monitoring
- Set up Vercel Analytics
- Configure Sentry for error tracking
- Monitor Stripe webhooks
- Track file upload usage

---

**Built with ⚡ by XP Beats Team**

*Ready to dominate the beat market? Let's go! 🎵*