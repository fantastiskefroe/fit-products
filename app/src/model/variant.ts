import {Id} from "./id";

export interface Variant {
  id: Id,
  title: string,
  sku: string,
  price: number,
  inventory: number
}
