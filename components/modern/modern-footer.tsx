"use client";

import Link from "next/link";
import Image from "next/image";

export function ModernFooter() {
  const year = new Date().getFullYear();
  
  return (
    <div className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CallSureAI
            </span>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Transforming customer conversations with AI
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/features" className="hover:text-blue-600">Features</Link>
            <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            © {year} CallSureAI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}