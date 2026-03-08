// layout/Footer.tsx
import { Sparkles, Facebook, Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-xl text-white">KanBanBord AI</span>
            </div>
            <p className="text-sm">
              Transform your team's productivity with AI-powered task management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="#about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="#contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/#." className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/#." className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/#." className="hover:text-white transition">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition"><Facebook /></a>
              <a href="#" className="hover:text-white transition"><Twitter /></a>
              <a href="#" className="hover:text-white transition"><Linkedin /></a>
              <a href="#" className="hover:text-white transition"><Github /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} KanBanBord AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}