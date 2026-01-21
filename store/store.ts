import { create } from 'zustand';

export type UserRole = 'patient' | 'pharmacy' | 'driver';

interface User {
    id: string;
    phone: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatarUrl?: string;
    roles: UserRole[];
}

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    pharmacyId?: string;
    requiresPrescription?: boolean;
    prescriptionUrl?: string;
}

interface Location {
    latitude: number;
    longitude: number;
}

interface AppState {
    // Auth
    user: User | null;
    currentRole: UserRole;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setCurrentRole: (role: UserRole) => void;
    logout: () => void;

    // Cart
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;

    // Location
    userLocation: Location | null;
    setUserLocation: (location: Location) => void;
}

export const useStore = create<AppState>((set, get) => ({
    // Auth state
    user: null,
    currentRole: 'patient',
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setCurrentRole: (role) => set({ currentRole: role }),
    logout: () => set({ user: null, isAuthenticated: false, cart: [] }),

    // Cart state
    cart: [],

    addToCart: (item) => set((state) => {
        const existingItem = state.cart.find(i => i.productId === item.productId);
        if (existingItem) {
            return {
                cart: state.cart.map(i =>
                    i.productId === item.productId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                )
            };
        }
        return { cart: [...state.cart, item] };
    }),

    removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.productId !== productId)
    })),

    updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        )
    })),

    clearCart: () => set({ cart: [] }),

    getCartTotal: () => {
        const state = get();
        return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Location state
    userLocation: null,
    setUserLocation: (location) => set({ userLocation: location }),
}));
