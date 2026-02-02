import { create } from 'zustand';

type CartItem = { id: number; name: string };

type UIStore = {
  theme: 'light' | 'dark';
  cart: CartItem[];
  toggleTheme: () => void;
  addToCart: (item: CartItem) => void;
};

export const useUIStore = create<UIStore>((set) => {
  // Load cart from localStorage on init
  const savedCart = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('cart') || '[]') 
    : [];

  return {
    theme: 'light',
    cart: savedCart,
    toggleTheme: () =>
      set((s) => {
        const newTheme = s.theme === 'light' ? 'dark' : 'light';
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(newTheme);
          localStorage.setItem('theme', newTheme);
        }
        return { theme: newTheme };
      }),
    addToCart: (item) =>
      set((s) => {
        const updatedCart = [...s.cart, item];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return { cart: updatedCart };
      }),
  };
});