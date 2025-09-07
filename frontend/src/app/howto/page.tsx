'use client';

import { motion } from 'framer-motion';
import { FiUserPlus, FiLogIn, FiFileText, FiUsers, FiList, FiDollarSign } from 'react-icons/fi';

export default function HowToPage() {
  const steps = [
    {
      icon: <FiUserPlus className="w-8 h-8" />,
      title: "1. Create an Account",
      description: "Sign up for a free account using your email address. Create a strong password to secure your account. Your data will be safely stored and you can access your bills anytime.",
    },
    {
      icon: <FiLogIn className="w-8 h-8" />,
      title: "2. Log In",
      description: "Access your account by logging in with your registered email and password. We use secure authentication to protect your information.",
    },
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: "3. Create a Bill",
      description: "Start by creating a new bill. Give it a name, date, and description. This could be for a dinner, trip expenses, shared rent, or any other shared costs.",
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "4. Add Participants",
      description: "Add the people who will share the bill. You can add their names and contact information. These are the people who will split the expenses with you.",
    },
    {
      icon: <FiList className="w-8 h-8" />,
      title: "5. Add Bill Items",
      description: "Enter each expense item in the bill along with who paid for it. For example, if John paid for dinner, add the dinner expense and mark John as the payer.",
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: "6. Assign Split Participants",
      description: "For each item, select who should share in paying for it. You can split items equally or set custom amounts for each person.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 py-16 px-4">
      <div className="max-w-4xl mx-auto mt-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How to Use <span className='text-blue-500'>HanBill</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Follow these simple steps to start splitting bills with your friends
          </p>
        </motion.div>

        {/* Steps Section */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start space-x-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ready to start splitting bills effortlessly?
          </p>
          <div className="space-x-4">
            <a
              href="/register"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Create Account
            </a>
            <a
              href="/login"
              className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Log In
            </a>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          className="mt-16 bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            💡 Pro Tips
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Add a description to your bills to remember what they were for</li>
            <li>You can split items unequally if needed</li>
            <li>Keep track of who has paid their share in the bill details</li>
            <li>Use the search function to find specific bills quickly</li>
            <li>Export bill summaries to share with your group</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
