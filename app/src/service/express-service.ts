import {Service} from '../model/service';
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import {Product} from "../model/product";
import {Raw} from "../model/raw";
import {Variant} from "../model/variant";
import {Tag} from "../model/tag";
import {Category} from "../model/category";

export class ExpressService implements Service {
  public readonly name = "Express";
  public readonly environmentVariables = [
    'PORT'
  ];

  private static readonly URL_PREFIX = 'https://fantastiskefroe.dk';
  private static readonly ALL_PRODUCTS_URL = `${ExpressService.URL_PREFIX}/collections/all-products`;

  private server;

  public init(): Promise<void> {
    const app = express();
    const port = process.env.PORT;

    const corsOptions = {
      origin: ["http://localhost:8080", /\.fantastiskefroe\.dk$/]
    };

    app.use(cors(corsOptions));

    app.get('/all', this.getAll.bind(this));
    app.get('/products', this.getAllProducts.bind(this));
    app.get('/tags', this.getAllTags.bind(this));
    app.get('/categories', this.getAllCategories.bind(this));

    return new Promise(resolve => {
      this.server = app.listen(port, () => {
        console.log(`Listening on port ${port}`);
        resolve();
      });
    });
  }

  public destruct(): Promise<void> {
    return new Promise(resolve => {
      this.server.close(() => resolve());
    });
  }

  private getAll(_req, res) {
    this.fetchAll()
    .then(rawInput => ({
      products: ExpressService.mapProducts(rawInput),
      tags: ExpressService.mapTags(rawInput),
      categories: ExpressService.mapCategories(rawInput)
    }))
    .then(products => res.json(products));
  }

  private getAllProducts(_req, res) {
    this.fetchAll()
    .then(ExpressService.mapProducts)
    .then(products => res.json(products));
  }

  private getAllTags(_req, res) {
    this.fetchAll()
    .then(ExpressService.mapTags)
    .then(products => res.json(products));
  }

  private getAllCategories(_req, res) {
    this.fetchAll()
    .then(ExpressService.mapCategories)
    .then(products => res.json(products));
  }

  private async fetchAll(): Promise<Raw> {
    const options = {
      method: 'GET'
    };

    return fetch(ExpressService.ALL_PRODUCTS_URL, options)
    .then(response => response.text())
    .then(text => (JSON.parse(text) as Raw))
    .catch(error => {
      console.error('error', error);

      return {
        products: {},
        tags: [],
        types: []
      };
    });
  }

  private static mapProducts(rawInput: Raw): Product[] {
    const result: Product[] = [];
    for (const rawProduct of Object.values(rawInput.products)) {
      const variants: Variant[] = [];
      for (const rawVariant of Object.values(rawProduct.variants)) {
        variants.push(rawVariant);
      }

      result.push({
        id: rawProduct.id,
        title: rawProduct.title,
        handle: rawProduct.handle,
        url: ExpressService.URL_PREFIX + rawProduct.url,
        imageUrl: rawProduct.image,
        tags: rawProduct.tags,
        category: rawProduct.type,
        variants: variants
      });
    }

    return result;
  }

  private static mapTags(rawInput: Raw): Tag[] {
    return rawInput.tags;
  }

  private static mapCategories(rawInput: Raw): Category[] {
    return rawInput.types;
  }
}
