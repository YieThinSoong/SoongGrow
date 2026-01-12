'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Save, ArrowLeft, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Fertilizer',
  'Pesticide',
  'Labor',
  'Equipment',
  'Fuel',
  'Other'
];

export default function AddExpense() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Fertilizer',
    item: '',
    amount: '',
    image: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save');
      
      router.push('/'); // Go back to dashboard
      router.refresh();
    } catch (error) {
      alert('Error saving expense! Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white pb-20">
      {/* Header */}
      <div className="bg-emerald-800 p-4 sticky top-0 z-10 flex items-center shadow-lg">
        <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-emerald-700">
           <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">New Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-md mx-auto">
        
        {/* Date & Category */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm text-neutral-400 block mb-1">Date</label>
                <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-neutral-800 p-3 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none"
                    required 
                />
            </div>
            <div>
                <label className="text-sm text-neutral-400 block mb-1">Category</label>
                <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-neutral-800 p-3 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none"
                >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {/* Amount */}
        <div>
           <label className="text-sm text-emerald-400 font-bold block mb-1">AMOUNT (RM)</label>
           <input 
                type="number" 
                inputMode="decimal"
                placeholder="0.00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-neutral-800 p-4 text-3xl font-bold text-white rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none placeholder-neutral-600"
                required
           />
        </div>

         {/* Item Description */}
         <div>
           <label className="text-sm text-neutral-400 block mb-1">Item / Description</label>
           <input 
                type="text" 
                placeholder="e.g., NPK Blue Bags"
                value={formData.item}
                onChange={e => setFormData({...formData, item: e.target.value})}
                className="w-full bg-neutral-800 p-3 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none"
                required
           />
        </div>

        {/* Receipt Photo */}
        <div>
            <label className="text-sm text-neutral-400 block mb-2">Receipt Photo (Optional)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-600 rounded-lg bg-neutral-800 cursor-pointer hover:bg-neutral-700 transition">
                {formData.image ? (
                    <img src={formData.image} alt="Preview" className="h-full object-contain" />
                ) : (
                    <div className="flex flex-col items-center pt-5 pb-6 text-neutral-400">
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-xs">Tap to snap</span>
                    </div>
                )}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
            </label>
        </div>

        {/* Notes */}
        <div>
             <label className="text-sm text-neutral-400 block mb-1">Notes</label>
             <textarea 
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-neutral-800 p-3 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none"
             />
        </div>

        {/* Submit Button */}
        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
            {loading ? <Loader2 className="animate-spin" /> : <Save />}
            {loading ? 'Saving to Cloud...' : 'SAVE EXPENSE'}
        </button>

      </form>
    </div>
  );
}
