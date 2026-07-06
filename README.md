<p align="center">
  <img src="public/images/logotest.png" alt="Kim Thao Trang Jewelry" width="300" />
</p>

# Kim Thao Trang Jewelry

A full-stack e-commerce web application for a fine jewelry store in Hồ Chí Minh City, Vietnam. Built as a complete rebuild from a static HTML/CSS site into a modern, animated, production-ready Next.js application.

**Live Demo → [kimthaotrang.vercel.app](https://kimthaotrang.vercel.app)**

---

## Features

### Customer-Facing
- **Product Gallery** — filterable by category (rings, necklaces, bracelets, earrings), sortable by price, with real-time search by name or description
- **Product Lightbox** — click any product image to open a full-screen modal with details, pricing, and inquiry CTA
- **Favorites System** — save products with an animated heart toggle, persisted to Supabase per user
- **Contact Form** — inquiry form with rate limiting, phone number validation, and optional product pre-fill from the products page
- **FAQ Chatbot** — floating chat widget with clickable + typeable questions, keyword matching, and fallback to contact page
- **User Auth** — email/password registration with real-time password strength meter and requirement checklist

### Admin Dashboard (Protected Route)
- **Products** — full CRUD with skeleton loading, animated row removal
- **Inquiries** — status management (New / In Progress / Resolved), per-inquiry delete, bulk "Clear All Resolved"
- **Users** — real registered accounts pulled from Supabase Auth via a secure server-side API route, searchable by name or email, showing join date, last active, and verification status

### UI/UX
- **Framer Motion animations** throughout — scroll-triggered reveals, staggered card entrances, page transitions, skeleton loaders, spring interactions
- **Scroll-zoom sections** on About and Services pages using `useScroll` + `useTransform`
- **Animated marquee banner** — pure CSS, no extra library
- **Count-up stats** with scramble/slot-machine effect on the About page
- **Staggered letter reveal** on section headings
- **Active nav indicator** that slides between links using Framer Motion `layoutId`
- **Back to top button** — springs in after 400px scroll
- **Custom 404 page** with floating animation
- Fully responsive — mobile sidebar navigation with spring animations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| API Routes | Next.js Route Handlers |
| Fonts | Playfair Display, Cormorant Garamond |
| Carousel | Embla Carousel |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

---

## Architecture Highlights

**Secure admin user management** — The Users tab in the admin dashboard queries Supabase `auth.users` (normally inaccessible client-side) via a Next.js API route that uses the service role key server-side, validates the requester's session token, and confirms admin status before returning any data. The service role key never reaches the browser.

**Rate limiting** — Contact form and auth routes use server-side rate limiting to prevent abuse.

**Row Level Security** — All Supabase tables have RLS policies ensuring users can only access their own data.

---

## Project Structure

```
jewelry-store-fs/
├── src/
│   ├── app/
│   │   ├── about/             # About page with scroll-zoom + scramble stats
│   │   ├── admin/             # Admin dashboard (products / inquiries / users)
│   │   │   └── products/edit/ # Edit product page
│   │   ├── api/
│   │   │   ├── admin/users/   # Secure server-side user fetch (service role)
│   │   │   ├── auth/          # Rate-limited auth endpoints
│   │   │   └── contact/       # Rate-limited contact form endpoint
│   │   ├── contact/           # Contact form + Google Maps embed
│   │   ├── favorites/         # Favorites page with lightbox
│   │   ├── login/             # Login with animated inputs
│   │   ├── products/          # Product gallery with search + lightbox
│   │   ├── register/          # Register with password strength meter
│   │   ├── services/          # Services with alternating scroll-slide layout
│   │   ├── not-found.tsx      # Custom 404 page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage with marquee + category grid
│   ├── components/
│   │   ├── Navbar.tsx         # Sticky nav with active link indicator + clock
│   │   ├── Footer.tsx         # Footer matching site palette
│   │   ├── Carousel.tsx       # Auto-playing image carousel
│   │   ├── PageTransition.tsx # Framer Motion page fade wrapper
│   │   ├── BackToTop.tsx      # Spring-animated scroll-to-top button
│   │   └── FaqChatbot.tsx     # Floating FAQ chat widget
│   ├── context/
│   │   └── AuthContext.tsx    # Auth state + isAdmin check
│   └── lib/
│       └── supabase.ts        # Supabase client
├── public/images/             # Static assets
├── .env.example               # Environment variable template
├── supabase-setup.sql         # Database setup script
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Supabase account (free tier)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/tonyt243/Jewelry-Store-FullStack.git
cd Jewelry-Store-FullStack

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

>**Never commit `.env.local`** — it's gitignored by default. The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security and must stay server-side only.

```bash
# 4. Set up the database
# Open Supabase → SQL Editor → paste supabase-setup.sql → Run

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To access the admin dashboard, register an account using the email you set as `NEXT_PUBLIC_ADMIN_EMAIL`.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Email address that gets admin access |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — server-side only, never expose publicly |

---

## Author

Built by **Huy Ta** — [github.com/tonyt243](https://github.com/tonyt243)

---

## License

MIT