export interface MockAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  loyaltyPoints: number;
  status: 'active' | 'suspended';
}

export interface VendorReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  rating: number;
  contact: string;
  reviews: VendorReview[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  images?: string[];
  category: 'Cafea Boabe' | 'Echipamente' | 'Patiserie' | 'Accesorii';
  quantity: number;
  unit: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  lowStockAlert: boolean;
  restockRequested?: boolean;
  reviews?: ProductReview[];
}

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
}

export interface Order {
  id: string;
  type: 'marketplace' | 'pickup' | 'reservation_addon';
  customerName: string;
  details: string;
  totalPrice: number;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'shipped';
  date: string;
  paymentMethod?: 'cash' | 'card';
  deliveryCourier?: string;
  shippingAddress?: string;
  contactPhone?: string;
  items?: OrderItem[];
}

// ========================
// MOCK DATA
// ========================

export let mockAccounts: MockAccount[] = [
  { id: "admin-001", name: "Administrator", email: "admin@thechic.com", role: "admin", loyaltyPoints: 0, status: "active" },
  { id: "user-vip-001", name: "Alexandra Ionescu", email: "vip@thechic.com", role: "user", loyaltyPoints: 3450, status: "active" },
  { id: "user-002", name: "Mihai Popescu", email: "mihai.p@example.com", role: "user", loyaltyPoints: 120, status: "active" },
  { id: "user-003", name: "Elena Dumitru", email: "elena.d@example.com", role: "user", loyaltyPoints: 450, status: "active" },
  { id: "user-004", name: "Spammer Cont", email: "spam.test@example.com", role: "user", loyaltyPoints: 0, status: "suspended" },
];

export let mockVendors: Vendor[] = [
  {
    id: "vend-1",
    name: "Symphony Coffee Roasters",
    description: "Prăjitorie premiată și respectată la nivel mondial, concentrată strict pe loturi etiopiene și africane de mare altitudine.",
    rating: 4.9,
    contact: "contact@symphony.ro",
    reviews: [
      { id: "vrev-1", author: "Specialty Coffee Assoc.", rating: 5, text: "Un profil de prăjire mediu care păstrează perfect aciditatea.", date: "Februarie 2026" },
      { id: "vrev-2", author: "Barista Magazine", rating: 5, text: "Furnizor de o consistență nemaivăzută în ultimii ani.", date: "Noiembrie 2025" }
    ]
  },
  {
    id: "vend-2",
    name: "Andean Beans Direct",
    description: "Importator de cafea de origine din America de Sud, cu o politică transparentă de plată superioară către micii fermieri.",
    rating: 4.7,
    contact: "sales@andean-beans.com",
    reviews: [
      { id: "vrev-3", author: "Organic Roasters", rating: 4, text: "Columbia Supremo este o boabă curată. O mică întârziere la livrare ultima dată.", date: "Ianuarie 2026" }
    ]
  },
  {
    id: "vend-3",
    name: "Sage Appliances",
    description: "Echipamente prosumer de ultimă generație pentru extracția cafelei.",
    rating: 4.8,
    contact: "b2b@sage.eu",
    reviews: [
      { id: "vrev-4", author: "Tech Reviewer", rating: 5, text: "Aparate extrem de fiabile, retururi aproape zero.", date: "Martie 2026" }
    ]
  },
  {
    id: "vend-4",
    name: "Brutăria Franceză",
    description: "Laborator artizanal de patiserie care rulează foietajele manual pline cu un unt proaspăt irezistibil.",
    rating: 4.5,
    contact: "comenzi@brutaria.ro",
    reviews: [
      { id: "vrev-5", author: "Client Anonim", rating: 5, text: "Cei mai buni croissanți. Punct.", date: "Martie 2026" },
      { id: "vrev-6", author: "Blogger Culinar", rating: 4, text: "Calitate superioară, dar stocul se epuizează prea repede.", date: "Decembrie 2025" }
    ]
  },
  {
    id: "vend-5",
    name: "Hario Japan",
    description: "Lider mondial în producția de accesorii, sticlărie și echipamente brew pentru prepararea manuală a cafelei.",
    rating: 5.0,
    contact: "distributor@hario.jp",
    reviews: [
      { id: "vrev-7", author: "Magazin Speciality", rating: 5, text: "Carafele și filtrele sunt indispensabile în orice brew bar. Fără cusur.", date: "Martie 2026" }
    ]
  },
  {
    id: "vend-6",
    name: "Precision Brew Tools",
    description: "Distribuitor autorizat de echipamente de precizie pentru laborator și casă, incluzând brandurile Fellow, Comandante și Acaia.",
    rating: 4.9,
    contact: "orders@precisionbrew.ro",
    reviews: [
      { id: "vrev-8", author: "Brew Guru", rating: 5, text: "Standardul de aur pentru orice setup serios.", date: "Aprilie 2026" }
    ]
  },
  {
    id: "vend-7",
    name: "Clay & Fire Studio",
    description: "Atelier de ceramică artizanală unde fiecare piesă este creată manual dintr-un amestec propriu de argilă, arsă la temperaturi înalte pentru durabilitate.",
    rating: 4.8,
    contact: "hello@clayfire.ro",
    reviews: [
      { id: "vrev-9", author: "Design Digest", rating: 5, text: "O simbioză perfectă între ergonomie și estetică minimalistă.", date: "Martie 2026" }
    ]
  }
];

export let mockInventory: InventoryItem[] = [
  { id: "inv-001", name: "Etiopia Yirgacheffe (Prăjire Medie)", description: "Boabe cu note florale și de bergamotă, prăjite mediu pentru filtru sau espresso modern.", price: 120, imageUrl: "/images/etiopia.png", images: ["/images/etiopia.png", "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1620189507195-68309c04c4d0?q=80&w=1000&auto=format&fit=crop"], category: "Cafea Boabe", quantity: 25, unit: "kg", vendorId: "vend-1", vendorName: "Symphony Coffee Roasters", vendorRating: 4.9, lowStockAlert: false, reviews: [{ id: "prev-1", author: "Cunoscător Cafea", rating: 5, text: "O aciditate citrică spectaculoasă, face un V60 perfect. 5/5", date: "Aprilie 2026" }] },
  { id: "inv-002", name: "Columbia Supremo", description: "Clasicul sud-american, onctuos, cu note clare de ciocolată cu lapte și caramel.", price: 110, imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1620189507195-68309c04c4d0?q=80&w=1000&auto=format&fit=crop"], category: "Cafea Boabe", quantity: 4, unit: "kg", vendorId: "vend-2", vendorName: "Andean Beans Direct", vendorRating: 4.7, lowStockAlert: true },
  { id: "inv-003", name: "Espressor Sage Barista Express", description: "Aparat manual cu râșniță integrată pentru acasă, perfect pentru pasionații de espresso.", price: 3200, imageUrl: "/images/sage_premium.png", images: ["/images/sage_premium.png", "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop"], category: "Echipamente", quantity: 2, unit: "buc", vendorId: "vend-3", vendorName: "Sage Appliances", vendorRating: 4.8, lowStockAlert: true, reviews: [{ id: "prev-2", author: "Home Barista", rating: 5, text: "Funcționează absolut minunat, controlul temperaturii este foarte precis.", date: "Martie 2026" }] },
  { id: "inv-004", name: "Croissant cu Unt", description: "Foietaj artizanal cu unt de 82% grăsime, rulat manual în laboratorul nostru.", price: 14, imageUrl: "/images/menu_croissant.png", images: ["/images/menu_croissant.png", "https://images.unsplash.com/photo-1549996647-190b679b33d7?q=80&w=1000&auto=format&fit=crop"], category: "Patiserie", quantity: 45, unit: "buc", vendorId: "vend-4", vendorName: "Brutăria Franceză", vendorRating: 4.5, lowStockAlert: false },
  { id: "inv-005", name: "Carafa Hario V60", description: "Carafa de sticlă termorezistentă, mărimea 02, ideală pentru prepararea prin picurare.", price: 180, imageUrl: "/images/hario.png", images: ["/images/hario.png", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1000&auto=format&fit=crop"], category: "Accesorii", quantity: 12, unit: "buc", vendorId: "vend-5", vendorName: "Hario Japan", vendorRating: 5.0, lowStockAlert: false },
  { id: "inv-006", name: "Fellow Stagg EKG Kettle", description: "Fierbător electric cu gât de lebădă și control al temperaturii, finisat în negru mat.", price: 950, imageUrl: "/images/fellow_stagg.png", images: ["/images/fellow_stagg.png", "/images/fellow_stagg_2.png"], category: "Echipamente", quantity: 5, unit: "buc", vendorId: "vend-6", vendorName: "Precision Brew Tools", vendorRating: 4.9, lowStockAlert: true },
  { id: "inv-007", name: "Comandante C40 Grinder", description: "Râșniță manuală de elită, dotată cu cuțite Nitro Blade pentru o uniformitate extremă a măcinăturii.", price: 1250, imageUrl: "/images/comandante.png", images: ["/images/comandante.png", "/images/comandante_2.png"], category: "Echipamente", quantity: 3, unit: "buc", vendorId: "vend-6", vendorName: "Precision Brew Tools", vendorRating: 4.9, lowStockAlert: true },
  { id: "inv-008", name: "Kenya AA Nyeri", description: "Specialty coffee cu aciditate vibrantă, note de mure și finish de caramel.", price: 145, imageUrl: "/images/kenya_aa.png", images: ["/images/kenya_aa.png", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop"], category: "Cafea Boabe", quantity: 15, unit: "kg", vendorId: "vend-1", vendorName: "Symphony Coffee Roasters", vendorRating: 4.9, lowStockAlert: false },
  { id: "inv-009", name: "Hario V60 Copper Dripper", description: "Dripper premium din cupru pentru o conductivitate termică excelentă.", price: 420, imageUrl: "/images/hario_copper.png", images: ["/images/hario_copper.png", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1000&auto=format&fit=crop"], category: "Accesorii", quantity: 8, unit: "buc", vendorId: "vend-5", vendorName: "Hario Japan", vendorRating: 5.0, lowStockAlert: true },
  { id: "inv-010", name: "Acaia Lunar Scale", description: "Cântar de precizie rezistent la apă, conceput pentru espresso și integrare perfectă pe tava de scurgere.", price: 1400, imageUrl: "/images/acaia_lunar.png", images: ["/images/acaia_lunar.png", "/images/acaia_lunar_2.png"], category: "Accesorii", quantity: 6, unit: "buc", vendorId: "vend-6", vendorName: "Precision Brew Tools", vendorRating: 4.9, lowStockAlert: true },
  { id: "inv-011", name: "Artisan Ceramic Cup Set", description: "Set de 2 cești din ceramică artizanală, smălțuite manual în nuanțe pământii.", price: 210, imageUrl: "/images/ceramic_cups.png", images: ["/images/ceramic_cups.png", "/images/ceramic_cups_2.png"], category: "Accesorii", quantity: 15, unit: "set", vendorId: "vend-7", vendorName: "Clay & Fire Studio", vendorRating: 4.8, lowStockAlert: false },
  { id: "inv-012", name: "The Chic Signature Blend", description: "Pâlnia noastră de semnătură. Un cupaj echilibrat din boabe de origine unică, prăjit săptămânal.", price: 160, imageUrl: "/images/signature_blend.png", images: ["/images/signature_blend.png", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop"], category: "Cafea Boabe", quantity: 20, unit: "kg", vendorId: "vend-1", vendorName: "Symphony Coffee Roasters", vendorRating: 4.9, lowStockAlert: false },
];

export let mockOrders: Order[] = [
  { id: "ord-1001", type: "marketplace", customerName: "Elena Dumitru", details: "Espressor Sage Barista Express", totalPrice: 3200, status: "shipped", date: "2026-04-05 10:30", paymentMethod: "card", deliveryCourier: "Fan Courier", shippingAddress: "Str. Victoriei 12, Bucuresti", contactPhone: "0722111222" },
  { id: "ord-1002", type: "pickup", customerName: "Mihai Popescu", details: "2x Flat White, 1x Croissant", totalPrice: 45, status: "ready", date: "2026-04-06 08:15" },
  { id: "ord-1003", type: "reservation_addon", customerName: "Alexandra Ionescu", details: "+ Șampanie Laurent-Perrier", totalPrice: 450, status: "pending", date: "2026-04-10 19:00" },
  { id: "ord-1004", type: "marketplace", customerName: "Client Anonim", details: "Set Degustare Cafea (4x250g)", totalPrice: 180, status: "processing", date: "2026-04-06 09:45", paymentMethod: "cash", deliveryCourier: "DHL", shippingAddress: "Bd. Unirii 45, Bucuresti", contactPhone: "0733444555" },
];

export let contactInfo = {
  address: "Strada Prăjitorilor 12, București, România",
  phone: "+40 722 000 000",
  email: "hello@thechic.com",
  schedule: "Luni - Vineri: 09:00 - 18:00"
};

export interface SupportTicket {
  id: string;
  vendorId: string;
  vendorName: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  date: string;
}

export let mockTickets: SupportTicket[] = [
  {
    id: 'tic-001',
    vendorId: 'vend-1',
    vendorName: 'Symphony Coffee Roasters',
    subject: 'Afișaj greșit stoc',
    message: 'Bună ziua, am modificat stocul la 25kg, dar pe prima pagină apare încă ca redus.',
    status: 'open',
    date: '2026-04-16 09:12'
  }
];

// ========================
// HELPER FUNCTIONS (SIMULATED DB ACTIONS)
// ========================

// ACCOUNT FUNCTIONS
export const getAccounts = () => mockAccounts;
export const deleteAccount = (id: string) => {
  mockAccounts = mockAccounts.filter(acc => acc.id !== id);
  return mockAccounts;
};
export const addAccount = (name: string, email: string) => {
  const newAcc: MockAccount = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: "user",
    loyaltyPoints: 0,
    status: "active"
  };
  mockAccounts = [...mockAccounts, newAcc];
  return mockAccounts;
};

// INVENTORY & VENDOR FUNCTIONS
export const getVendors = () => mockVendors;
export const getVendorById = (id: string) => mockVendors.find(v => v.id === id);
export const addVendor = (name: string, description: string, contact: string) => {
  const newVendor: Vendor = {
    id: `vend-${Date.now()}`,
    name,
    description,
    rating: 0,
    contact,
    reviews: []
  };
  mockVendors = [...mockVendors, newVendor];
  return mockVendors;
};

export const getInventory = () => mockInventory;
export const updateInventoryQuantity = (id: string, newQuantity: number) => {
  mockInventory = mockInventory.map(item =>
    item.id === id ? { ...item, quantity: newQuantity, lowStockAlert: newQuantity < 10 } : item
  );
  return mockInventory;
};

export const requestRestock = (id: string) => {
  mockInventory = mockInventory.map(item =>
    item.id === id ? { ...item, restockRequested: true } : item
  );
  return mockInventory;
};

// ORDER FUNCTIONS
export const getOrders = () => mockOrders;
export const addOrder = (order: Order) => {
  mockOrders = [order, ...mockOrders];
  return mockOrders;
};

export const updateOrderStatus = (id: string, newStatus: Order['status']) => {
  mockOrders = mockOrders.map(order =>
    order.id === id ? { ...order, status: newStatus } : order
  );
  return mockOrders;
};

export const decreaseInventoryQuantity = (cartItems: { id: string, requestedQuantity: number }[]) => {
  mockInventory = mockInventory.map(item => {
    const cartHit = cartItems.find(ci => ci.id === item.id);
    if (cartHit) {
      const newQuantity = Math.max(0, item.quantity - cartHit.requestedQuantity);
      return { ...item, quantity: newQuantity, lowStockAlert: newQuantity < 10 };
    }
    return item;
  });
  return mockInventory;
};

// ANALYTICS FUNCTIONS
export const getProductSalesStats = (productName: string, productPrice: number) => {
  let totalUnits = 0;

  mockOrders.forEach(order => {
    if (order.type !== 'marketplace') return;

    const items = order.details.split(', ');
    items.forEach(item => {
      let qty = 1;
      let name = item;

      const match = item.match(/^(\d+)x (.+)$/);
      if (match) {
        qty = parseInt(match[1]);
        name = match[2];
      }

      if (name.trim().toLowerCase() === productName.trim().toLowerCase()) {
        totalUnits += qty;
      }
    });
  });

  return {
    totalUnits,
    totalRevenue: totalUnits * productPrice
  };
};

// VENDOR SPECIFIC FUNCTIONS
export const addInventoryItem = (item: InventoryItem) => {
  mockInventory = [...mockInventory, item];
  return mockInventory;
};

export const deleteInventoryItem = (id: string) => {
  mockInventory = mockInventory.filter(item => item.id !== id);
  return mockInventory;
};

export const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
  mockInventory = mockInventory.map(item =>
    item.id === id ? { ...item, ...updates, lowStockAlert: (updates.quantity ?? item.quantity) < 10 } : item
  );
  return mockInventory;
};

export const fulfillRestock = (id: string, additionalQty: number) => {
  mockInventory = mockInventory.map(item =>
    item.id === id ? {
      ...item,
      quantity: item.quantity + additionalQty,
      restockRequested: false,
      lowStockAlert: (item.quantity + additionalQty) < 10
    } : item
  );
  return mockInventory;
};

export const getOrdersByVendor = (vendorId: string) => {
  return mockOrders.filter(order => {
    if (order.type !== 'marketplace') return false;

    const items = order.details.split(', ');
    return items.some(item => {
      let name = item;
      const match = item.match(/^(\d+)x (.+)$/);
      if (match) name = match[2];

      const product = mockInventory.find(i => i.name.toLowerCase() === name.trim().toLowerCase());
      return product?.vendorId === vendorId;
    });
  });
};

export const addProductReview = (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => {
  const productIndex = mockInventory.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    const newReview: ProductReview = {
      ...review,
      id: `prev-${Date.now()}`,
      date: new Date().toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })
    };
    const product = mockInventory[productIndex];
    mockInventory[productIndex] = {
      ...product,
      reviews: [newReview, ...(product.reviews || [])]
    };
  }
};

export const updateContactInfo = (updates: Partial<typeof contactInfo>) => {
  contactInfo = { ...contactInfo, ...updates };
  return contactInfo;
};

export const getTickets = () => mockTickets;

export const addTicket = (vendorId: string, vendorName: string, subject: string, message: string) => {
  const newTicket: SupportTicket = {
    id: `tic-${Date.now()}`,
    vendorId,
    vendorName,
    subject,
    message,
    status: 'open',
    date: new Date().toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'short' })
  };
  mockTickets = [newTicket, ...mockTickets];
  return newTicket;
};

export const resolveTicket = (id: string) => {
  mockTickets = mockTickets.map(t => t.id === id ? { ...t, status: 'resolved' } : t);
  return mockTickets;
};
