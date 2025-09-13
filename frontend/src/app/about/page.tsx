'use client';

import { FiUsers, FiDollarSign, FiPieChart, FiSmartphone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

export default function AboutPage() {
  const features = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: 'Split Expenses with Friends',
      description: 'Easily share expenses with your friends, whether it’s food, accommodation, or other costs.'
    },
    {
      icon: <FiDollarSign className="w-6 h-6" />,
      title: 'Automatic Calculation',
      description: 'The system automatically calculates expense shares, so you don’t have to worry about mistakes.'
    },
    {
      icon: <FiPieChart className="w-6 h-6" />,
      title: 'Track Expenses',
      description: 'View your expense history and summaries anytime, with easy-to-understand graphs.'
    },
    {
      icon: <FiSmartphone className="w-6 h-6" />,
      title: 'Accessible Anywhere',
      description: 'Works on all devices including computers, tablets, and mobile phones.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center mt-15">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to <span className='text-blue-500'>HanBill</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          The app that makes splitting expenses with friends easy, 
          whether it’s for meals, accommodation, or any other shared costs.
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Start Using HanBill Today
          </h2>
          <p className="text-blue-100 mb-8">
            Sign up for free and start managing shared expenses with your friends right away.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Sign Up for Free
          </a>
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
}
