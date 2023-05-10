export interface Product {
  id: number
  name: string
  image?: string
  price: number
  priceDiscount: number
  type?: string
  quantity: number
  rating: number | null
  categories: string[]
  updatedAt: Date | null
}

export interface Pagination {
  limit: number
  page: number
  total: number
}

export interface GetProductsResponse {
  pagination: Pagination
  products: Product[]
}

export interface GetProductByIdResponse {
  id: number
  name: string
  price: number
  priceDiscount: number
  quantity: number
  vendor: string
  shortInfo: string[]
  description: string
  slug: string | null
  isDraft: boolean
  isPublish: boolean
  type: {
    id?: number
    name?: string
  }
  attributes: {
    id: number
    value: string
  }[]
  images: {
    id: number
    name: string
    link: string
    alt: string
    deleteHash: string
    order: number
  }[]
  categories: {
    id: number
    name: string
  }[]
}
