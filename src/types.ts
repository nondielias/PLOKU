export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Audio' | 'Wearables' | 'Workstation' | 'Power & Docks' | 'Vision & Optics' | 'Accessories';
  description: string;
  specs: ProductSpec[];
  image: string;
  stock: number;
  featured?: boolean;
  tag?: string;
  createdAt?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  role: 'client' | 'admin';
  createdAt: number | string;
  fileCount?: number;
}

export interface UserFile {
  id: string;
  userId: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  description?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string; // e.g., "15557565800"
  currencySymbol: string;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

