# Kim Thao Trang Jewelry - Full Stack Web Application

##  Project Overview

This is a complete redesign and upgrade of the Kim Thao Trang Jewelry store website, transforming it from a static HTML/CSS site into a dynamic full-stack application with user authentication, admin dashboard, and database integration.

##  Features

### Customer Features
-  **User Authentication System**
-  **Product Gallery**
-  **Favorites System**
-  **Contact System**
-  **Additional Pages**
  

### Admin Features
-  **Admin Dashboard** (Protected Route)
-  **Product Management**
-  **Inquiry Management**
-  **User Management**


### UI/UX Features
-  **Modern Design**
-  **Interactive Elements**
  

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Playfair Display, Cormorant Garamond)
- **UI Components**: Custom components with Lucide React icons
- **Image Carousel**: Embla Carousel React
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **API**: Next.js API Routes (built-in)
- **File Storage**: Public folder for static assets
- **Security**: Row Level Security (RLS) policies

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git & GitHub
- **Code Editor**: VS Code (recommended)
- **Node Version**: 18+ required

##  Project Structure
```
jewelry-store-fs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About Us page
│   │   ├── admin/             # Admin dashboard
│   │   │   └── products/
│   │   │       └── edit/[id]/ # Edit product page
│   │   ├── contact/           # Contact page with map
│   │   ├── favorites/         # User favorites page
│   │   ├── login/             # Login page
│   │   ├── products/          # Products gallery
│   │   ├── register/          # Registration page
│   │   ├── services/          # Services page
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   ├── page.tsx           # Homepage with carousel
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Navbar.tsx         # Navigation with auth & clock
│   │   ├── Footer.tsx         # Footer with store info
│   │   └── Carousel.tsx       # Auto-playing image carousel
│   ├── context/               # React Context
│   │   └── AuthContext.tsx    # Authentication & admin state
│   └── lib/                   # Utilities
│       └── supabase.ts        # Supabase client configuration
├── public/
│   └── images/                # Static images (logo, products, carousel)
├── .env.example               # Environment variables template
├── supabase-setup.sql         # Database setup script
├── LICENSE                    # MIT License
├── README.md                  # Project documentation
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
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
   
   Create a `.env.local` file in the root directory (use `.env.example` as template):
```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
```

4. **Set up Supabase Database**
   
   Run the database setup script:
   
   a. Open your Supabase project dashboard
   
   b. Go to **SQL Editor**
   
   c. Click **"New Query"**
   
   d. Copy the entire contents of [`supabase-setup.sql`](./supabase-setup.sql)
   
   e. **IMPORTANT**: Replace all instances of `'your-admin-email@example.com'` with your actual admin email
   
   f. Click **"Run"** or press `Ctrl+Enter`
   
   g. Wait for success message: "Success. No rows returned"

5. **Configure Supabase Authentication**
   
   a. Go to **Authentication** → **Providers**
   
   b. Enable **Email** provider
   
   c. Disable **"Confirm email"** (for development)
   
   d. Click **Save**

6. **Run the development server**
```bash
   npm run dev
```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

8. **Create admin account**
   
   a. Click **"Login"** → **"Create one here"**
   
   b. Register with the email you set as `NEXT_PUBLIC_ADMIN_EMAIL`
   
   c. You'll now have access to the **Admin Dashboard** via the navbar


