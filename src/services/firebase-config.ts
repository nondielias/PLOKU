/**
 * PLOKU Electronic Gadget Store - Firebase Configuration & Local Store Service
 *
 * Configured with Firebase Authentication only as per requirements.
 * Firestore and Storage are bypassed for now.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { Product, StoreSettings, UserAccount, UserFile, ProductReview } from '../types';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts';

// Web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyCDC4kZQqagtS2jNy6KMw0cIfLzJoyhwZM",
  authDomain: "ploku-c650d.firebaseapp.com",
  projectId: "ploku-c650d",
  storageBucket: "ploku-c650d.firebasestorage.app",
  messagingSenderId: "637990224181",
  appId: "1:637990224181:web:fbf9b8a174cd309119cc7c"
};

// Initialize Firebase App
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'PLOKU',
  whatsappNumber: '15557565800',
  currencySymbol: '$',
  firebaseConfig: {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  }
};

const STORAGE_KEY_PRODUCTS = 'ploku_products_catalog_v1';
const STORAGE_KEY_SETTINGS = 'ploku_store_settings_v1';
const STORAGE_KEY_USERS = 'ploku_firestore_users_cache_v1';
const STORAGE_KEY_FILES = 'ploku_firestore_files_cache_v1';
const STORAGE_KEY_REVIEWS = 'ploku_product_reviews_v1';

// Seed initial demo users for admin view demonstration
export const INITIAL_DEMO_USERS: UserAccount[] = [
  {
    id: 'user-sarah-101',
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.tech',
    role: 'client',
    createdAt: '2026-08-14T09:30:00Z',
    fileCount: 3,
    phone: '+1 555-019-2834',
    address: '42 Cyber Plaza, Tech City, CA'
  },
  {
    id: 'user-marcus-102',
    name: 'Marcus Vance',
    email: 'marcus.vance@soundlabs.io',
    role: 'client',
    createdAt: '2026-09-02T14:15:00Z',
    fileCount: 2,
    phone: '+1 555-018-9120',
    address: '88 Acoustic Ave, Seattle, WA'
  },
  {
    id: 'user-elena-103',
    name: 'Elena Rostova',
    email: 'elena.rostova@designmatrix.de',
    role: 'client',
    createdAt: '2026-09-20T11:45:00Z',
    fileCount: 4,
    phone: '+49 30 901820',
    address: 'Alexanderplatz 14, Berlin, Germany'
  },
  {
    id: 'user-alex-104',
    name: 'Alex Reed',
    email: 'alex.reed@avantgarde.co',
    role: 'client',
    createdAt: '2026-10-01T16:20:00Z',
    fileCount: 1,
    phone: '+1 555-014-7712',
    address: '500 Mission St, San Francisco, CA'
  },
  {
    id: 'g0rDnAnuQjVj6A4ffob8sm4Y8rM2',
    name: 'Admin Georges',
    email: 'admin@ploku.store',
    role: 'admin',
    createdAt: '2026-07-01T08:00:00Z',
    fileCount: 5,
    phone: '+1 555-756-5800',
    address: 'PLOKU Global Headquarters, Austin, TX'
  }
];

export const INITIAL_DEMO_FILES: Record<string, UserFile[]> = {
  'user-sarah-101': [
    {
      id: 'file-s-1',
      userId: 'user-sarah-101',
      name: 'titanium_chassis_cad_spec.step',
      size: 4280000,
      type: 'application/step',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-08-16T10:14:00Z',
      description: '3D CAD assembly blueprint for custom titanium casing'
    },
    {
      id: 'file-s-2',
      userId: 'user-sarah-101',
      name: 'audio_dsp_tuning_curve.pdf',
      size: 1420000,
      type: 'application/pdf',
      url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-08-20T14:30:00Z',
      description: 'Parametric EQ and noise cancelation calibration curves'
    },
    {
      id: 'file-s-3',
      userId: 'user-sarah-101',
      name: 'firmware_update_v4.2.bin',
      size: 890000,
      type: 'application/octet-stream',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-09-01T09:00:00Z',
      description: 'Compiled binary firmware flash for CyberPulse DAC'
    }
  ],
  'user-marcus-102': [
    {
      id: 'file-m-1',
      userId: 'user-marcus-102',
      name: 'invoice_plk_4429.pdf',
      size: 320000,
      type: 'application/pdf',
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-09-03T11:20:00Z',
      description: 'Official tax invoice & customs declaration'
    },
    {
      id: 'file-m-2',
      userId: 'user-marcus-102',
      name: 'warranty_certificate_ring.pdf',
      size: 512000,
      type: 'application/pdf',
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-09-04T15:45:00Z',
      description: '2-Year biometric ring hardware warranty pass'
    }
  ],
  'user-elena-103': [
    {
      id: 'file-e-1',
      userId: 'user-elena-103',
      name: 'keyboard_pcb_gerber.zip',
      size: 6140000,
      type: 'application/zip',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-09-22T08:15:00Z',
      description: 'Custom hot-swap PCB schematics and solder layers'
    },
    {
      id: 'file-e-2',
      userId: 'user-elena-103',
      name: 'ergonomic_layout_spec.png',
      size: 1980000,
      type: 'image/png',
      url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-09-24T12:00:00Z',
      description: 'Wrist rest angle calculation and split tilt diagram'
    },
    {
      id: 'file-e-3',
      userId: 'user-elena-103',
      name: 'keycap_profile_guide.pdf',
      size: 840000,
      type: 'application/pdf',
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-09-28T16:20:00Z',
      description: 'Cherry vs low-profile spherical actuation height report'
    },
    {
      id: 'file-e-4',
      userId: 'user-elena-103',
      name: 'purchase_invoice_891.pdf',
      size: 275000,
      type: 'application/pdf',
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-09-30T10:10:00Z',
      description: 'Apex 75 mechanical keyboard dispatch receipt'
    }
  ],
  'user-alex-104': [
    {
      id: 'file-a-1',
      userId: 'user-alex-104',
      name: 'gan_power_benchmark_log.csv',
      size: 154000,
      type: 'text/csv',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-10-02T13:40:00Z',
      description: 'Thermal dissipation and wattage delivery telemetry log'
    }
  ],
  'g0rDnAnuQjVj6A4ffob8sm4Y8rM2': [
    {
      id: 'file-adm-1',
      userId: 'g0rDnAnuQjVj6A4ffob8sm4Y8rM2',
      name: 'ploku_global_inventory_q4.xlsx',
      size: 2400000,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-10-04T08:00:00Z',
      description: 'Warehouse stock allocations and supply chain tracking'
    },
    {
      id: 'file-adm-2',
      userId: 'g0rDnAnuQjVj6A4ffob8sm4Y8rM2',
      name: 'customs_import_clearance_eu.pdf',
      size: 1100000,
      type: 'application/pdf',
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-10-04T09:30:00Z',
      description: 'CE and FCC hardware compliance certificates'
    },
    {
      id: 'file-adm-3',
      userId: 'g0rDnAnuQjVj6A4ffob8sm4Y8rM2',
      name: 'whatsapp_gateway_webhook_spec.json',
      size: 64000,
      type: 'application/json',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-10-05T11:15:00Z',
      description: 'API configuration for automated order dispatching'
    },
    {
      id: 'file-adm-4',
      userId: 'g0rDnAnuQjVj6A4ffob8sm4Y8rM2',
      name: 'oled_screen_batch_calibration.log',
      size: 890000,
      type: 'text/plain',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-10-05T14:40:00Z',
      description: 'Horizon 4K portable OLED panel Delta-E factory calibration'
    },
    {
      id: 'file-adm-5',
      userId: 'g0rDnAnuQjVj6A4ffob8sm4Y8rM2',
      name: 'store_audit_security_rules.md',
      size: 45000,
      type: 'text/markdown',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      uploadedAt: '2026-10-06T02:00:00Z',
      description: 'Firestore security rule audit and user isolation report'
    }
  ]
};

export function loadStoreSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('[PLOKU Settings] Failed to parse local settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoreSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('[PLOKU Settings] Failed to save settings', e);
  }
}

/**
 * Fetch all products from local cache / default catalog
 */
export async function fetchProducts(): Promise<{ products: Product[]; source: 'firestore' | 'local' }> {
  try {
    const localRaw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (localRaw) {
      const parsed = JSON.parse(localRaw) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { products: parsed, source: 'local' };
      }
    }
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
  return { products: DEFAULT_PRODUCTS, source: 'local' };
}

export async function saveProduct(product: Product): Promise<Product> {
  const { products } = await fetchProducts();
  const existingIdx = products.findIndex((p) => p.id === product.id);
  const updatedList = existingIdx >= 0
    ? products.map((p) => (p.id === product.id ? product : p))
    : [product, ...products];

  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updatedList));
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { products } = await fetchProducts();
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(filtered));
  return true;
}

export async function resetToDefaultCatalog(): Promise<Product[]> {
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

/**
 * User & File management (using local cache only - no Firestore/Storage)
 */
export async function fetchUsersFromFirestore(): Promise<UserAccount[]> {
  try {
    const cached = localStorage.getItem(STORAGE_KEY_USERS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_DEMO_USERS));
  return INITIAL_DEMO_USERS;
}

export async function fetchUserFilesFromFirestore(userId: string): Promise<UserFile[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FILES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[userId]) {
        return parsed[userId];
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_DEMO_FILES[userId] || [];
}

/**
 * Do NOT save user profile data to Firestore (as explicitly requested).
 */
export async function saveUserToFirestore(user: UserAccount): Promise<void> {
  // No-op: Do not save user profile data
  console.info('[PLOKU Auth] Skipping user profile Firestore save (Authenticate users only mode active)');
}

export async function uploadUserFileToFirestore(
  userId: string,
  fileData: { name: string; size: number; type: string; url: string; description?: string }
): Promise<UserFile> {
  const fileId = `file-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newFile: UserFile = {
    id: fileId,
    userId,
    name: fileData.name,
    size: fileData.size,
    type: fileData.type,
    url: fileData.url,
    uploadedAt: new Date().toISOString(),
    description: fileData.description || 'Uploaded user document'
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_FILES) || '{}';
    const parsed = JSON.parse(raw);
    parsed[userId] = [newFile, ...(parsed[userId] || [])];
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(parsed));

    const usersRaw = localStorage.getItem(STORAGE_KEY_USERS);
    if (usersRaw) {
      const users = JSON.parse(usersRaw) as UserAccount[];
      const uIdx = users.findIndex((u) => u.id === userId);
      if (uIdx >= 0) {
        users[uIdx].fileCount = (users[uIdx].fileCount || 0) + 1;
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      }
    }
  } catch {
    // ignore
  }

  return newFile;
}

export async function deleteUserFileFromFirestore(userId: string, fileId: string): Promise<boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FILES) || '{}';
    const parsed = JSON.parse(raw);
    if (parsed[userId]) {
      parsed[userId] = parsed[userId].filter((f: UserFile) => f.id !== fileId);
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(parsed));
    }
  } catch {
    // ignore
  }
  return true;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export const INITIAL_DEMO_REVIEWS: Record<string, ProductReview[]> = {
  'plk-01': [
    {
      id: 'rev-01-1',
      productId: 'plk-01',
      userId: 'user-marcus-102',
      userName: 'Marcus Vance',
      rating: 5,
      comment: 'The pure Beryllium drivers deliver surgical soundstage separation. Dual DSP active noise cancellation effortlessly silenced my long flights. Truly flagship tier hardware!',
      createdAt: '2026-09-12T10:30:00Z'
    },
    {
      id: 'rev-01-2',
      productId: 'plk-01',
      userId: 'user-elena-103',
      userName: 'Elena Rostova',
      rating: 5,
      comment: 'Bead-blasted titanium finish feels indestructible yet featherweight. Lambskin memory foam cups remain cool even after a 6-hour studio session.',
      createdAt: '2026-09-25T14:10:00Z'
    }
  ],
  'plk-02': [
    {
      id: 'rev-02-1',
      productId: 'plk-02',
      userId: 'user-sarah-101',
      userName: 'Sarah Connor',
      rating: 5,
      comment: 'Clinical accuracy for sleep tracking and temperature fluctuations. Zero monthly subscriptions is the game changer. Barely feel it on my finger.',
      createdAt: '2026-09-08T08:45:00Z'
    }
  ],
  'plk-03': [
    {
      id: 'rev-03-1',
      productId: 'plk-03',
      userId: 'user-alex-104',
      userName: 'Alex Reed',
      rating: 5,
      comment: 'Full CNC anodized unibody gives zero flex. Low-profile tactile switches are lubricated to perfection. Triple connectivity swaps between Mac and PC instantaneously.',
      createdAt: '2026-10-02T16:20:00Z'
    }
  ],
  'plk-04': [
    {
      id: 'rev-04-1',
      productId: 'plk-04',
      userId: 'user-sarah-101',
      userName: 'Sarah Connor',
      rating: 5,
      comment: 'The real-time OLED wattage readout makes it fun to see dynamic power negotiations. Handles my 16" laptop and tablet simultaneously at full 140W speed without getting hot.',
      createdAt: '2026-10-03T11:00:00Z'
    }
  ]
};

export async function fetchProductReviewsFromFirestore(productId: string): Promise<ProductReview[]> {
  try {
    const cachedRaw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw);
      if (parsed[productId]) {
        return parsed[productId];
      }
    }
  } catch {
    // ignore
  }

  const initial = INITIAL_DEMO_REVIEWS[productId] || [];
  return initial;
}

export async function addProductReviewToFirestore(
  productId: string,
  data: {
    userId?: string;
    userName: string;
    rating: number;
    comment: string;
  }
): Promise<ProductReview> {
  const reviewId = `rev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newReview: ProductReview = {
    id: reviewId,
    productId,
    userId: data.userId || 'guest-user',
    userName: data.userName.trim() || 'Verified Buyer',
    rating: Math.max(1, Math.min(5, Math.round(data.rating))),
    comment: data.comment.trim(),
    createdAt: new Date().toISOString()
  };

  try {
    const cachedRaw = localStorage.getItem(STORAGE_KEY_REVIEWS) || '{}';
    const cached = JSON.parse(cachedRaw);
    cached[productId] = [newReview, ...(cached[productId] || [])];
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(cached));
  } catch {
    // ignore
  }

  return newReview;
}
