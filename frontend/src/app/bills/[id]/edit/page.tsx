'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { billService, type Participant, type BillItem, type BillWithShares } from '@/lib/services/billService';

export default function EditBillPage() {
  const router = useRouter();
  const params = useParams();
  const billId = parseInt(params.id as string);
  
  console.log('params:', params, 'billId:', billId); // Debug log
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [billName, setBillName] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '' });
  const [newItem, setNewItem] = useState({
    name: '',
    amount: 0,
    paidBy: '',
    splitBetween: [] as string[],
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Load existing bill data
  useEffect(() => {
    if (billId && !isNaN(billId)) {
      loadBillData();
    } else {
      console.error('Invalid bill ID:', billId);
      alert('Invalid bill ID');
      router.push('/bills');
    }
  }, [billId]);

    const loadBillData = async () => {
    try {
        setLoading(true);
        const bill = await billService.getBill(billId);
        console.log("Received bill data:", bill);

        // map field จาก backend → state
        setBillName(bill.title || "");            // title → billName
        setDescription(bill.description || "");

        const participantsArray = Array.isArray(bill.participants)
        ? bill.participants
        : [];

        const itemsArray = Array.isArray(bill.items)
        ? bill.items.map((i) => ({
            ...i,
            amount: i.price,                   // price → amount
            }))
        : [];

        setParticipants(participantsArray);
        setItems(itemsArray);
    } catch (error) {
        console.error("Error loading bill:", error);
        alert(error instanceof Error ? error.message : "Failed to load bill data.");
        router.push("/bills");
    } finally {
        setLoading(false);
    }
    };

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.email) {
      // Check if email already exists
      const emailExists = participants?.some(p => p.email === newParticipant.email);
      if (emailExists) {
        alert('Participant with this email already exists!');
        return;
      }
      
      setParticipants([
        ...participants,
        { ...newParticipant, id: generateId() },
      ]);
      setNewParticipant({ name: '', email: '' });
    }
  };

  const removeParticipant = (id: string) => {
    // Check if participant is used in any items
    const isUsedInItems = items.some(
      item => item.paidBy === id || item.splitBetween.includes(id)
    );
    
    if (isUsedInItems) {
      if (!confirm('This participant is used in bill items. Removing them will also remove them from those items. Continue?')) {
        return;
      }
    }

    setParticipants(participants.filter((p) => p.id !== id));
    // Clean up items
    setItems(
      items.map((item) => ({
        ...item,
        splitBetween: item.splitBetween.filter((pid) => pid !== id),
        paidBy: item.paidBy === id ? '' : item.paidBy,
      }))
    );
  };

  const addItem = () => {
    if (newItem.name && newItem.amount > 0 && newItem.paidBy && newItem.splitBetween.length > 0) {
      setItems([
        ...items,
        { 
          ...newItem, 
          id: generateId(), 
          price: newItem.amount // For API compatibility
        },
      ]);
      setNewItem({
        name: '',
        amount: 0,
        paidBy: '',
        splitBetween: [],
      });
    } else {
      alert('Please fill in all item details and select at least one person to split with.');
    }
  };

  const removeItem = (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        setSaving(true);
        const billData = {
        title: billName,         // ใช้ title ให้ตรง backend
        description,
        participants,
        items: items.map(item => ({
            ...item,
            price: item.amount,    // map amount → price
        })),
        };

        await billService.updateBill(billId, billData);
        alert('Bill updated successfully!');
        router.push(`/bills/${billId}`);
    } catch (error) {
        console.error('Error updating bill:', error);
        alert(error instanceof Error ? error.message : 'Failed to update bill. Please try again.');
    } finally {
        setSaving(false);
    }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12">
        <div className="max-w-4xl mx-auto px-4 mt-15">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading bill data...</span>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12">
      <div className="max-w-4xl mx-auto px-4 mt-15">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Bill
          </h1>
          <button
            onClick={() => router.push(`/bills/${billId}`)}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bill Details Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Bill Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bill Name *
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter bill description"
                  rows={3}
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
                <div className="flex-1">
                  <input
                    type="email"
                    value={newParticipant.email}
                    onChange={(e) =>
                      setNewParticipant({ ...newParticipant, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Email"
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
                {participants?.map((participant) => (
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
              
              {participants.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  No participants added yet. Add at least one participant.
                </p>
              )}
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
                  Paid by *
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
                  Split between * (select at least one)
                </label>
                {participants.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    Add participants first to split bills
                  </p>
                ) : (
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
                )}
              </div>

              <button
                type="button"
                onClick={addItem}
                disabled={participants.length === 0}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                        Paid by: {participants.find((p) => p.id === item.paidBy)?.name || 'Unknown'}
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
                        {participants.find((p) => p.id === participantId)?.name || 'Unknown'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {items.length === 0 && (
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  No items added yet. Add at least one item.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  <span>Update Bill</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Debug Info - Remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Debug Info:</h3>
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
              {JSON.stringify({
                billId,
                participantsCount: participants.length,
                itemsCount: items.length,
                billName,
                description
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}