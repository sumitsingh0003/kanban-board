// layout/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KanBanBord AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition">
              Features
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-blue-600 transition">
              About
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition">
              Pricing
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition">
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="#features" className="text-gray-600 hover:text-blue-600">Features</Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600">About</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
              <div className="pt-4 flex flex-col space-y-2">
                <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">Get Started</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}