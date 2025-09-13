import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              💸 Bill Splitter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              The easiest way to split bills with friends. Calculate, share, and settle up without the hassle.
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link 
                href="/about" 
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                About
              </Link>
              <Link 
                href="/howto" 
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                How to Use
              </Link>
              <Link 
                href="/login" 
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Bill Splitter. Split bills, not friendships.
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <span>Built with</span>
              <span className="text-red-500 animate-pulse">🩵</span>
              <span>by</span>
              <a 
                href="https://portfoliotnp.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-gray-900 dark:text-white hover:underline hover:underline-offset-4 transition-colors"
              >
                Thanapon
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}