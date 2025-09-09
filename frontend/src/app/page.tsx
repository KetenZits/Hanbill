'use client';

import Link from "next/link";
import Image from "next/image";
import { FiDollarSign, FiUsers, FiClock } from "react-icons/fi";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 mt-10">
        <main className="flex flex-col items-center gap-16">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Split Bills with{" "}
              <span className="text-blue-600 dark:text-blue-400">Friends</span>
              {" "}Easily
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Simplify your group expenses and keep track of who owes what. 
              No more awkward money conversations with friends!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Get Started
              </Link>
              <Link 
                href="/howto" 
                className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-lg border border-gray-200 dark:border-gray-700"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FiDollarSign size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Easy Bill Splitting
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Split bills equally or customize amounts for each person. Perfect for dinners, trips, or household expenses.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FiUsers size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Group Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create groups for different occasions and track expenses with different friend circles easily.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FiClock size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant updates on payments and balances. Stay on top of who owes what.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-blue-600 dark:bg-blue-700 text-white p-12 rounded-2xl w-full max-w-4xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Splitting Bills?
            </h2>
            <p className="text-lg mb-8 text-blue-100">
              Join thousands of users who make bill splitting easy with HanBill
            </p>
            <Link 
              href="/register" 
              className="px-8 py-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium text-lg inline-block"
            >
              Create Free Account
            </Link>
          </div>

        </main>
        
        {/* Footer */}
        <footer className="flex gap-[24px] flex-wrap items-center justify-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 dark:text-gray-400"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 dark:text-gray-400"
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
        </footer>
      </div>
    </div>
  );
}