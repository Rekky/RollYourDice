import {ProductBlock} from './ProductBlock';
import { ulid } from 'ulid';


export class Post {
  id: string;
  type: string;
  title: string | null;
  author: string | null;
  date: string | Date;
  tags: string[];
  slug: string;
  published: boolean;
  products: ProductBlock[] | null;
  coverImage: string;
  backgroundImage?: string | null;
  description: string;
  featured: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt: string | Date;

  constructor(
    id?: string,
    type?: string,
    title?: string,
    author?: string,
    date?: string | Date,
    slug?: string,
    published?: boolean,
    products?: ProductBlock[],
    featured?: boolean,
    createdAt?: string | Date,
    publishedAt?: string | Date
  ) {
    this.id = ulid();
    this.type = type ? type : 'review';
    this.title = title ? title : null;
    this.author = author ? author : null;
    this.date = date ? date : new Date();
    this.slug = slug ? slug : '-';
    this.published = published ? published : false;
    this.products = products ? products : [];
    this.tags = [];
    this.coverImage = '';
    this.description = '';
    this.backgroundImage = '';
    this.featured = featured ? featured : false;
    this.createdAt = createdAt ? createdAt : new Date();
    this.publishedAt = publishedAt ? publishedAt : new Date();
  }
}
