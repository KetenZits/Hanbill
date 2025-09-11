'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FiDollarSign, FiUsers, FiShare2 } from 'react-icons/fi';

interface Participant {
  id: number;
  name: string;
  email: string;
}

interface Item {
  id: number;
  name: string;
  price: number;
  payer: Participant;
  splitBetween: Participant[];
}

interface Bill {
  id: number;
  title: string;
  description?: string;
  participants: Participant[];
  items: Item[];
}

interface ShareCalculation {
  participant_id: number;
  paid: number;
  owes: number;
  net: number;
}

export default function BillDetailsPage() {
  const params = useParams();
  const [bill, setBill] = useState<Bill | null>(null);
  const [shares, setShares] = useState<Record<number, ShareCalculation>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBill() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/bills/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch bill details');
        
        const data = await response.json();
        setBill(data.bill);
        setShares(data.shares);
      } catch (err) {
        setError('Failed to load bill details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBill();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 p-6 mt-10">
        <div className="max-w-4xl mx-auto bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
          {error || 'Bill not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {/* Bill Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {bill.title}
            </h1>
            {bill.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {bill.description}
              </p>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <FiDollarSign className="text-blue-500 text-2xl" />
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Amount</h3>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        ${(bill.items.reduce((sum, item) => sum + Number(item.price), 0)).toFixed(2)}
                    </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <FiUsers className="text-blue-500 text-2xl" />
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Participants</h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {bill.participants.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <FiShare2 className="text-blue-500 text-2xl" />
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Items</h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {bill.items.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Items</h2>
              <div className="space-y-4">
                {bill.items.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Paid by: {item.paidByParticipant?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.split_between_participants?.map((participant) => (
                        <span
                          key={participant.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {participant.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settlement Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Settlement</h2>
              <div className="space-y-4">
                {bill.participants.map((participant) => {
                  const share = shares[participant.id];
                  if (!share) return null;

                  return (
                    <div key={participant.id} className="flex justify-between items-center">
                      <span className="text-gray-900 dark:text-white">{participant.name}</span>
                      <span className={`font-semibold ${
                        share.net > 0 
                          ? 'text-green-600 dark:text-green-400'
                          : share.net < 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {share.net > 0 ? '+' : ''}{share.net.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}