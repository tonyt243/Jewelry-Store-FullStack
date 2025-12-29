# Kim Thao Trang Jewelry - Full Stack Web Application

A modern, full-stack jewelry store website built with Next.js, featuring user authentication, product galleries, and customer engagement features.


##  Project Overview

This is a complete redesign and upgrade of the Kim Thao Trang Jewelry store website, transforming it from a static HTML/CSS site into a dynamic full-stack application with user authentication and database integration.

##  Features Implemented

### Current Features (Completed)

-  **User Authentication System**
  - User registration with email/password
  - User login/logout functionality
  - Protected routes for logged-in users
  - Welcome message displaying user's name
  - Session management with Supabase Auth

-  **Modern UI/UX**
  - Responsive design using Tailwind CSS
  - Animated navigation with hover effects (underline animations)
  - Custom wheat/beige color scheme matching brand logo
  - Professional logo integration in navbar
  - Smooth transitions and button animations

-  **Homepage**
  - Hero section with brand logo
  - Auto-playing image carousel (4-second intervals)
  - "Shop By Category" section (Rings, Necklaces, Bracelets, Earrings)
  - Responsive layout for mobile and desktop

-  **Navigation**
  - Sticky navbar with logo
  - Dynamic menu (shows "Favorites" only when logged in)
  - Animated hover effects on all links
  - Login/Logout buttons with scale animations
  - User greeting in navbar

-  **Database Setup (Supabase)**
  - PostgreSQL database configured
  - Tables created:
    - `products` - Jewelry items (name, description, price, category, image)
    - `favorites` - User's saved items
    - `inquiries` - Customer contact messages
  - Row Level Security (RLS) policies implemented
  - User metadata storage for names

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Image Carousel**: Embla Carousel React
- **Deployment**: Vercel (planned)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes (built-in)
- **File Storage**: Public folder for static assets

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git & GitHub
- **Code Editor**: VS Code (recommended)
- **Node Version**: 18+ required

## 📁 Project Structure

```
jewelry-store-fs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── Navbar.tsx         # Navigation bar with auth
│   │   ├── Footer.tsx         # Footer with store info
│   │   └── Carousel.tsx       # Image carousel
│   ├── context/               # React Context
│   │   └── AuthContext.tsx    # Authentication state management
│   └── lib/                   # Utilities
│       └── supabase.ts        # Supabase client configuration
├── public/
│   └── images/                # Static images (logo, products, carousel)
├── .env.local                 # Environment variables (not committed)
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier)
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tonyt243/Jewelry-Store-FullStack.git
   cd Jewelry-Store-FullStack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase Database**
   
   Run this SQL in your Supabase SQL Editor:
   ```sql
   -- Products table
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price DECIMAL(10, 2),
     category TEXT NOT NULL,
     image_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );

   -- Favorites table
   CREATE TABLE favorites (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     product_id UUID REFERENCES products(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     UNIQUE(user_id, product_id)
   );

   -- Inquiries table
   CREATE TABLE inquiries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT,
     message TEXT NOT NULL,
     product_id UUID REFERENCES products(id) ON DELETE SET NULL,
     status TEXT DEFAULT 'new',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );

   -- Enable RLS
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
   ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

   -- Policies
   CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
   CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can remove favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);
   CREATE POLICY "Users can view their own inquiries" ON inquiries FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Anyone can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);
   ```

5. **Configure Supabase Authentication**
   - Go to Authentication → Providers
   - Enable Email provider
   - Disable "Confirm email" (for development)

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

