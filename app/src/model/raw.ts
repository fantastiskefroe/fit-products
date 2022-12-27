export interface Raw {
  products: Record<string, {
    id: string,
    title: string,
    handle: string,
    url: string,
    image: string,
    tags: string[],
    type: string,
    variants: Record<string, {
      id: string,
      title: string,
      sku: string,
      price: number,
      inventory: number
    }>
  }>,
  tags: string[],
  types: string[]
}
