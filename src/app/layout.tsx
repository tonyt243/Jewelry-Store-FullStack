'use client'
import './globals.css'
import { ReactNode } from 'react'
import { Clock, Cart } from './components/scripts'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <img className="logo" src="/images/logotest.png" alt="My Logo" />
          <Clock />
        </header>

        <nav className="menu">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
          <a href="/about">About Us</a>
          <a href="/account">My Account</a>
          <div className="cart-container">
            <Cart />
          </div>
        </nav>

        <main>{children}</main>

        <footer>{/* footer content */}</footer>
      </body>
    </html>
  )
}
