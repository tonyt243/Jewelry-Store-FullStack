'use client'
import { useState, useEffect } from 'react'

//Clock 
export function Clock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
      setTime(`${now.toLocaleDateString(undefined, options)} | ${now.toLocaleTimeString()}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return <div id="clock">{time}</div>
}

// Favorite button
export function FavoriteButton({
  name,
  favorites,
  toggleFavorite,
}: {
  name: string
  favorites: string[]
  toggleFavorite: (name: string) => void
}) {
  const isFav = favorites.includes(name)
  return (
    <button onClick={() => toggleFavorite(name)}>
      {isFav ? '❤️' : '🤍'}
    </button>
  )
}

//Cart
export function Cart() {
  const [cart, setCart] = useState<{ name: string; price: number; qty: number }[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0)

  return (
    <div>
      <button className="cart-button">
        🛒 <span>{cartCount}</span>
      </button>
      <div>Total: ${total}</div>
    </div>
  )
}

// Carousel
export function Carousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="carousel">
      <button onClick={prev}>◀</button>
      <img src={images[index]} alt={`Slide ${index}`} />
      <button onClick={next}>▶</button>
      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={i === index ? 'active' : ''}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  )
}
