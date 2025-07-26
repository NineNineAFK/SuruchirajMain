export interface NutritionValue {
  energy: number;
  fat: number;
  protein: number;
  carbohydrates: number;
  sugar: number;
}

export interface NutritionFacts {
  Energy: string;
  Fat: string;
  Protein: string;
  Carbohydrate: string;
  Sugar: string;
}

export interface NetWeight {
  value: number;
  unit: string;
}

export interface Product {
  _id: string;
  product_name: string;
  ingredients: string[];
  preservatives?: string;
  nutrition_facts_per_100gm_approx?: NutritionFacts;
  fssai_reg_no?: string;
  recipe?: string[];
  manufactured_marketed_by?: string;
  address?: string;
  email?: string;
  customer_care_no?: string;
  mrp?: number[];
  net_wt?: NetWeight[];
  best_before?: string;
  category: string[];
  cuisine?: string[];
  why_you_will_love_it?: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  stock: number; // add this for grams
  packaging_50gms: number;
  packaging_100gms: number;
  isVisible: boolean;
}

export interface ProductFormData {
  product_name: string;
  ingredients: string[];
  preservatives?: string;
  nutrition_facts_per_100gm_approx: {
    Energy: string;
    Fat: string;
    Protein: string;
    Carbohydrate: string;
    Sugar: string;
  };
  fssai_reg_no?: string;
  recipe?: string[];
  manufactured_marketed_by?: string;
  address?: string;
  email?: string;
  customer_care_no?: string;
  mrp?: number[];
  net_wt?: { value: number; unit: string }[];
  best_before?: string;
  category?: string[];
  cuisine?: string[];
  why_you_will_love_it?: string[];
  images?: string[];
  stock: number;
  packaging_50gms: number;
  packaging_100gms: number;
} 