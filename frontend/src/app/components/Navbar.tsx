'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSun, FiMoon } from 'react-icons/fi';

interface NavItem {
  name: string;
  path?: string;
  onClick?: () => void;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const publicNavItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How to', path: '/howto' },
  ];

  const authNavItems: NavItem[] = isLoggedIn
    ? [
        { name: 'Bills', path: '/bills' },
        { name: 'Logout', onClick: handleLogout },
      ]
    : [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
      ];

  const navItems: NavItem[] = [...publicNavItems, ...authNavItems];

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                onClick={closeMenu}
              >
                HanBill
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {navItems.map((item) => {
                  if (item.onClick) {
                    return (
                      <button
                        key={item.name}
                        onClick={item.onClick}
                        className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        {item.name}
                      </button>
                    );
                  }
                  
                  if (item.path) {
                    return (
                      <Link
                        key={item.name}
                        href={item.path}
                        className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out md:hidden z-40 ${
          isOpen 
            ? 'opacity-50 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out md:hidden z-50 shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link 
              href="/" 
              className="text-xl font-bold text-blue-600 dark:text-blue-400"
              onClick={closeMenu}
            >
              HanBill
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <HiX size={24} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => {
              if (item.onClick) {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick?.();
                      closeMenu();
                    }}
                    className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </button>
                );
              }
              
              if (item.path) {
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                );
              }

              return null;
            })}
          </div>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              © 2024 HanBill
            </p>
          </div>
        </div>
      </div>
    </>
  );
}