'use client'
import { useState } from 'react'
import { Carousel, FavoriteButton } from './components/scripts'
import Head from './components/head'

// Product type
type Product = {
  name: string
  image: string
}

// ProductCard component
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="options">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <button className="browse">Browse</button>
      {/* Add FavoriteButton if needed */}
    </div>
  )
}

// CategorySection component
function CategorySection({ title, products }: { title: string; products: Product[] }) {
  return (
    <div className="category">
      <h2>{title}</h2>
      <div className={title === 'Shop By Category' ? 'content' : 'content2'}>
        {products.map((p) => (
          <ProductCard key={p.name} product={p} />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const slides = [
    '/images/homepage-new.jpeg',
    '/images/carousel1.png',
    '/images/carousel2.png',
  ]

  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (name: string) =>
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    )

  const productsTop: Product[] = [
    { name: 'Rings', image: '/images/rings.webp' },
    { name: 'Necklaces', image: '/images/necklaces.webp' },
  ]

  const productsBottom: Product[] = [
    { name: 'Bracelets', image: '/images/bracelets.webp' },
    { name: 'Earrings', image: '/images/earrings.webp' },
  ]

  return (
    <div>
      <div className="welcome-banner">
        <h1>Welcome to Kim Thao Trang Jewelry</h1>
      </div>

      <Carousel images={slides} />

      <CategorySection title="Shop By Category" products={productsTop} />
      <CategorySection title="Other Categories" products={productsBottom} />
    </div>
  )
}
