import ProductsClient from './ProductsClient' 

export const metadata = {
  title: 'Products - My Jewelry Store',
  description: 'Explore our jewelry products, including rings and necklaces.',
  icons: {
    icon: [
      { url: '/images/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/favicon.png', type: 'image/png', sizes: '16x16' },
    ],
  },
}

export default function ProductsPage() {
  return <ProductsClient />
}
