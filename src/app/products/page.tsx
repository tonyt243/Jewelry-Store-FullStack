'use client'
import { useState } from 'react'
import { FavoriteButton, Cart, Clock } from '../components/scripts'

// Product type
type Product = {
  id: number
  name: string
  category: string
  image: string
  price: number
  qty?: number
}

// ProductCard component
function ProductCard({
  product,
  toggleFavorite,
  favorites,
  addToCart,
}: {
  product: Product
  toggleFavorite: (name: string) => void
  favorites: string[]
  addToCart: (product: Product) => void
}) {
  const isFav = favorites.includes(product.name)

  return (
    <div className={`product-card ${product.category}`}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Starting at: ${product.price}</p>
      <button className="add-to-cart" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
      <FavoriteButton
        name={product.name}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    </div>
  )
}

export default function ProductsPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const products: Product[] = [
    { id: 1, name: 'White Gold Ring', category: 'rings', image: '/images/white-gold-ring.jpeg', price: 120 },
    { id: 2, name: 'Rose Gold Ring', category: 'rings', image: '/images/rose-ring.jpeg', price: 560 },
    { id: 3, name: 'Flower Diamond Necklace', category: 'necklaces', image: '/images/flower-necklace.jpeg', price: 240 },
    { id: 4, name: 'Ruby Ring', category: 'rings', image: '/images/ruby-ring.webp', price: 250 },
    { id: 5, name: 'Pattern Gold Ring', category: 'rings', image: '/images/pattern-ring.webp', price: 100 },
    { id: 6, name: 'Ornament Ring', category: 'rings', image: '/images/ornament-ring.webp', price: 220 },
    { id: 7, name: 'Pearl Ring', category: 'rings', image: '/images/pearl-ring.webp', price: 300 },
    { id: 8, name: 'Diamond Heart Necklace', category: 'necklaces', image: '/images/heart-necklace.jpg', price: 600 },
  ]

  const toggleFavorite = (name: string) => {
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    )
  }

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: (item.qty || 1) + 1 }
            : item
        )
      } else {
        return [...prev, { ...product, qty: 1 }]
      }
    })
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div>

      {/* Page Title */}
      <h1 className="about-heading">Store Products</h1>

      {/* Search & Category Filter */}
      <div className="search-filter-container">
        <input
          id="productSearch"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          id="categorySelect"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="rings">Rings</option>
          <option value="necklaces">Necklaces</option>
          <option value="bracelets">Bracelets</option>
          <option value="earrings">Earrings</option>
        </select>
      </div>

      {/* Product Gallery */}
      <div className="product-gallery">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  )
}
