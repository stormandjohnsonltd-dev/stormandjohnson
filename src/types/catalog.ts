export type NamedRef = {
  _id: string;
  name: string;
  slug: string;
};

export type ProductCard = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  brand?: NamedRef | null;
  category?: NamedRef | null;
};

export type ProductDetail = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  brand?: NamedRef | null;
  category?: NamedRef | null;
  specs?: Array<{ label: string; value: string }>;
  features?: string[];
};
