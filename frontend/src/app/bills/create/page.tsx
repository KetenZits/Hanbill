'use client';

import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { billService } from '@/lib/services/billService';
import Footer from '@/app/components/Footer';

interface Participant {
  id: string;
  name: string;
  email: string;
}

interface BillItem {
  id: string;
  name: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
}

export default function CreateBillPage() {
  const [billName, setBillName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: ''});
  const [newItem, setNewItem] = useState({
    name: '',
    amount: 0,
    paidBy: '',
    splitBetween: [] as string[],
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addParticipant = () => {
    if (newParticipant.name) {
      setParticipants([
        ...participants,
        { ...newParticipant, id: generateId() },
      ]);
      setNewParticipant({ name: ''});
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
    // Also remove this participant from any items they were part of
    setItems(
      items.map((item) => ({
        ...item,
        splitBetween: item.splitBetween.filter((pid) => pid !== id),
        paidBy: item.paidBy === id ? '' : item.paidBy,
      }))
    );
  };

  const addItem = () => {
    if (newItem.name && newItem.amount > 0 && newItem.paidBy) {
      setItems([
        ...items,
        { ...newItem, id: generateId(), splitBetween: newItem.splitBetween },
      ]);
      setNewItem({
        name: '',
        amount: 0,
        paidBy: '',
        splitBetween: [],
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const billData = {
        name: billName,
        participants,
        items,
      };

      const billId = await billService.createBill(billData);
      window.location.href = `/bills/${billId}`;
    } catch (error) {
      console.error('Error creating bill:', error);
      alert(error instanceof Error ? error.message : 'Failed to create bill. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12">
      <div className="max-w-4xl mx-auto px-4 mt-15">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Create New Bill
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bill Details Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Bill Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bill Name
                </label>
                <input
                  type="text"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter bill name"
                />
              </div>
            </div>
          </div>

          {/* Participants Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Participants
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newParticipant.name}
                    onChange={(e) =>
                      setNewParticipant({ ...newParticipant, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Name"
                  />
                </div>
                <button
                  type="button"
                  onClick={addParticipant}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {participant.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {participant.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant.id)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Bill Items
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Item name"
                />
                <input
                  type="number"
                  value={newItem.amount || ''}
                  onChange={(e) =>
                    setNewItem({ ...newItem, amount: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Amount"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paid by
                </label>
                <select
                  value={newItem.paidBy}
                  onChange={(e) =>
                    setNewItem({ ...newItem, paidBy: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select who paid</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Split between
                </label>
                <div className="space-y-2">
                  {participants.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <input
                        type="checkbox"
                        checked={newItem.splitBetween.includes(p.id)}
                        onChange={(e) => {
                          const newSplitBetween = e.target.checked
                            ? [...newItem.splitBetween, p.id]
                            : newItem.splitBetween.filter((id) => id !== p.id);
                          setNewItem({ ...newItem, splitBetween: newSplitBetween });
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                      />
                      <span>{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <FiPlus className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Amount: ฿{item.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Paid by: {participants.find((p) => p.id === item.paidBy)?.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.splitBetween.map((participantId) => (
                      <span
                        key={participantId}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {participants.find((p) => p.id === participantId)?.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium"
          >
            Create Bill
          </button>
        </form>
      </div>
      <Footer/>
    </div>
  );
}
