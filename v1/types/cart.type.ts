export interface CartItem {
  id: number
  name: string
  image: {
    link: string
    alt: string
  }
  price: number
  priceDiscount: number
  inStock: number
  quantity: number
}
