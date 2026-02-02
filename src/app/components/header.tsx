"use client";

import Link from "next/link";
import { useUIStore } from "../store/UIStore";


export default function Header() {
  const { theme, toggleTheme, cart } = useUIStore();

  return (
    <header className="border-b">
      <nav className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <Link href="/" className="text-xl font-bold">
          Next.js App
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <Link href="/page2" className="relative inline-block text-xl">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}