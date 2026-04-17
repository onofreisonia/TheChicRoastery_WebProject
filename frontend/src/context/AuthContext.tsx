import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order, InventoryItem } from '../data/adminData';

export interface CartItem {
  item: InventoryItem;
  qty: number;
}

export interface BookingDetails {
  id: string;
  locationId: string;
  locationName: string;
  date: string;
  time: string;
  guests: number;
  addons?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'vendor';
  vendorId?: string;
  vendorRating?: number;
  loyaltyPoints: number;
  upcomingBookings: BookingDetails[];
  orderHistory: Order[];
}
{/*cont pentru testare*/ }
const vipMockAccount: User = {
  id: "user-vip-001",
  name: "Alexandra Ionescu",
  email: "vip@thechic.com",
  role: "user",
  loyaltyPoints: 3450,
  upcomingBookings: [
    {
      id: "res-18392",
      locationId: "loc-1",
      locationName: "The Chic Downtown",
      date: "2026-04-10",
      time: "19:00",
      guests: 2
    },
    {
      id: "res-19811",
      locationId: "loc-3",
      locationName: "Minimalist by The Chic",
      date: "2026-04-18",
      time: "11:00",
      guests: 4
    }
  ],
  orderHistory: [
    { id: "ord-1003", type: "reservation_addon", customerName: "Alexandra Ionescu", details: "+ Șampanie Laurent-Perrier", totalPrice: 450, status: "pending", date: "2026-04-10 19:00" }
  ]
};

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  addAddonToBooking: (bookingId: string, item: string) => void;
  addBookingToUser: (booking: Omit<BookingDetails, 'id'>) => void;
  addOrderToUser: (order: Order) => void;
  updateUser: (name: string, email: string) => void;

  cart: CartItem[];
  addToCart: (product: InventoryItem, quantity?: number) => void;
  updateCartQty: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('chic_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('chic_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('chic_user');
    }
  }, [user]);


  const login = (email: string) => {
    if (email.toLowerCase().includes("admin")) {
      setUser({
        id: "admin-001",
        name: "Administrator",
        email: "admin@thechic.com",
        role: 'admin',
        loyaltyPoints: 0,
        upcomingBookings: [],
        orderHistory: []
      });
    } else if (email.toLowerCase().includes("vip")) {
      setUser(vipMockAccount);
    } else if (email.toLowerCase().includes("hario")) {
      setUser({
        id: "vend-user-001",
        name: "Hario Global Support",
        email: email,
        role: 'vendor',
        vendorId: 'vend-5',
        vendorRating: 5.0,
        loyaltyPoints: 0,
        upcomingBookings: [],
        orderHistory: []
      });
    } else if (email.toLowerCase().includes("sage")) {
      setUser({
        id: "vend-user-002",
        name: "Sage Appliances B2B",
        email: email,
        role: 'vendor',
        vendorId: 'vend-3',
        vendorRating: 4.8,
        loyaltyPoints: 0,
        upcomingBookings: [],
        orderHistory: []
      });
    } else {
      setUser({
        id: `user-${Date.now()}`,
        name: "Cont Simplu",
        email: email,
        role: 'user',
        loyaltyPoints: 120,
        upcomingBookings: [],
        orderHistory: []
      });
    }
  };

  const register = (name: string, email: string) => {
    setUser({
      id: `user-${Date.now()}`,
      name: name,
      email: email,
      role: 'user',
      loyaltyPoints: 0,
      upcomingBookings: [],
      orderHistory: []
    });
  };

  const logout = () => setUser(null);

  const addAddonToBooking = (bookingId: string, item: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const updatedBookings = prev.upcomingBookings.map(b =>
        b.id === bookingId ? { ...b, addons: [...(b.addons || []), item] } : b
      );
      return { ...prev, upcomingBookings: updatedBookings };
    });
  };

  const addBookingToUser = (booking: Omit<BookingDetails, 'id'>) => {
    setUser(prev => {
      if (!prev) return prev;
      const newBooking: BookingDetails = {
        ...booking,
        id: `res-${Math.floor(Math.random() * 10000)}`
      };
      return { ...prev, upcomingBookings: [...prev.upcomingBookings, newBooking] };
    });
  };

  const addOrderToUser = (order: Order) => {
    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, orderHistory: [order, ...prev.orderHistory] };
    });
  };

  const updateUser = (name: string, email: string) => {
    setUser(prev => prev ? { ...prev, name, email } : null);
  };

  const addToCart = (product: InventoryItem, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.item.id === product.id);
      if (existing) {
        if (existing.qty + quantity > product.quantity) {
          alert(`Stoc maxim atins. Mai poți adăuga cel mult ${product.quantity - existing.qty} buc.`);
          return prev;
        }
        return prev.map(p => p.item.id === product.id ? { ...p, qty: p.qty + quantity } : p);
      }
      return [...prev, { item: product, qty: quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(p => {
      if (p.item.id === id) {
        const newQty = Math.max(0, p.qty + delta);
        if (newQty > p.item.quantity) {
          alert('Depășește stocul disponibil.');
          return p;
        }
        return { ...p, qty: newQty };
      }
      return p;
    }).filter(p => p.qty > 0));
  };

  const clearCart = () => setCart([]);

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, login, register, logout,
      addAddonToBooking, addBookingToUser, addOrderToUser, updateUser,
      cart, addToCart, updateCartQty, clearCart, isCartOpen, setIsCartOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
