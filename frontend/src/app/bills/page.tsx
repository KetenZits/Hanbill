'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiUsers, FiDollarSign, FiCalendar, FiEye, FiTrash2, FiEdit2 } from 'react-icons/fi';
import Footer from '../components/Footer';

interface Participant {
  id: number;
  name: string;
  email: string;
}

interface Bill {
  id: number;
  title: string;
  created_at: string;
  participants: Participant[];
  total_amount?: number;
  items_count?: number;
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/bills', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }

      const data = await response.json();
      setBills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteBill = async (billId: number) => {
    if (!confirm('Are you sure you want to delete this bill?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/bills/${billId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete bill');
      }

      setBills(bills.filter(bill => bill.id !== billId));
    } catch (err) {
      alert('Failed to delete bill');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 mt-10">
        <main>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Your <span className="text-blue-600 dark:text-blue-400">Bills</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Manage all your shared expenses in one place
            </p>
            <Link 
              href="/bills/create" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              <FiPlus size={20} />
              Create New Bill
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Bills Grid */}
          {bills.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <FiDollarSign size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No bills yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Create your first bill to start splitting expenses with friends
              </p>
              <Link 
                href="/bills/create" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                <FiPlus size={20} />
                Create Your First Bill
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 max-w-7xl mx-auto" style={{
              gridTemplateColumns: bills.length === 1 
                ? 'minmax(300px, 400px)' 
                : 'repeat(auto-fit, minmax(300px, 1fr))',
              justifyContent: 'center'
            }}>
              {bills.map((bill) => (
                <div 
                  key={bill.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
                >
                  {/* Bill Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {bill.title}
                    </h3>
                    <div className="flex gap-2 ml-2">
                      <Link
                        href={`/bills/${bill.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="View Bill"
                      >
                        <FiEye size={16} />
                      </Link>
                      <button
                        onClick={() => deleteBill(bill.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete Bill"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Bill Stats */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <FiUsers size={16} />
                      <span className="text-sm">
                        {bill.participants.length} participant{bill.participants.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <FiCalendar size={16} />
                      <span className="text-sm">
                        Created {formatDate(bill.created_at)}
                      </span>
                    </div>

                    {bill.total_amount && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <FiDollarSign size={16} />
                        <span className="text-sm">
                          Total: ${bill.total_amount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Participants Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Participants:</p>
                    <div className="flex flex-wrap gap-2">
                      {bill.participants.slice(0, 3).map((participant) => (
                        <span 
                          key={participant.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                        >
                          {participant.name}
                        </span>
                      ))}
                      {bill.participants.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          +{bill.participants.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/bills/${bill.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <FiEye size={16} />
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          {bills.length > 0 && (
            <div className="mt-16 bg-blue-600 dark:bg-blue-700 text-white p-8 rounded-2xl max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Your Bill Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-blue-100">
                      {bills.length}
                    </div>
                    <div className="text-blue-200">
                      Total Bills
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-100">
                      {bills.reduce((sum, bill) => sum + bill.participants.length, 0)}
                    </div>
                    <div className="text-blue-200">
                      Total Participants
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer/>
    </div>
  );
}