import {Tag} from "./tag";
import {Category} from "./category";
import {Id} from "./id";
import {Variant} from "./variant";

export interface Product {
    id: Id;
    title: string;
    handle: string;
    url: string;
    imageUrl: string;
    tags: Tag[];
    category: Category
    variants: Variant[];
}
