'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Save, ArrowLeft, Loader2, Plus, Trash2, MapPin } from 'lucide-react';

const CATEGORIES = [
  'Fertilizer',
  'Pesticide',
  'Labor',
  'Equipment',
  'Fuel',
  'Other'
];

interface Shop {
  id?: string;
  name: string;
  address: string;
  contact: string;
}

interface ExpenseItem {
  category: string;
  item: string;
  amount: string;
}

export default function AddExpense() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  
  // Common Data
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [customShopName, setCustomShopName] = useState(''); // If creating new on the fly or one-off
  const [image, setImage] = useState('');
  const [notes, setNotes] = useState('');

  // Items List
  const [items, setItems] = useState<ExpenseItem[]>([
    { category: 'Fertilizer', item: '', amount: '' }
  ]);

  useEffect(() => {
    fetch('/api/shops')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setShops(data);
      })
      .catch(err => console.error("Failed to fetch shops", err));
  }, []);

  const addItem = () => {
    setItems([...items, { category: 'Fertilizer', item: '', amount: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
        setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof ExpenseItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
        setSelectedShop(null);
        setCustomShopName('');
    } else {
        const shop = shops.find(s => s.name === value);
        setSelectedShop(shop || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
        date,
        shopName: selectedShop ? selectedShop.name : customShopName,
        shopAddress: selectedShop ? selectedShop.address : '',
        shopContact: selectedShop ? selectedShop.contact : '',
        items,
        image,
        notes
    };

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-neutral-900 text-white pb-32">
      {/* Header */}
      <div className="bg-emerald-800 p-4 sticky top-0 z-10 flex items-center shadow-lg">
        <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-emerald-700">
           <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">New Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-md mx-auto">
        
        {/* Date & Shop */}
        <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 space-y-4">
            <div>
                <label className="text-xs text-neutral-400 uppercase font-bold mb-1 block">Date</label>
                <input 
                    type="date" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-neutral-900 p-3 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none"
                    required 
                />
            </div>
            
            <div>
                 <label className="text-xs text-neutral-400 uppercase font-bold mb-1 block">Shop / Supplier</label>
                 <select 
                    onChange={handleShopChange}
                    className="w-full bg-neutral-900 p-3 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none mb-2"
                 >
                    <option value="custom">Other / One-off Shop</option>
                    {shops.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                 </select>

                 {!selectedShop && (
                    <input 
                        type="text" 
                        placeholder="Enter Shop Name"
                        value={customShopName}
                        onChange={e => setCustomShopName(e.target.value)}
                        className="w-full bg-neutral-900 p-3 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none"
                    />
                 )}
                 {selectedShop && selectedShop.address && (
                     <div className="flex items-start gap-2 text-xs text-neutral-400 mt-2 px-1">
                        <MapPin size={12} className="mt-0.5" />
                        {selectedShop.address}
                     </div>
                 )}
            </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
             <div className="flex items-center justify-between px-1">
                 <h2 className="text-sm font-bold text-neutral-400 uppercase">Items List</h2>
                 <span className="text-emerald-400 text-sm font-bold">Total: RM {totalAmount.toFixed(2)}</span>
             </div>
             
             {items.map((it, idx) => (
                <div key={idx} className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 relative animate-in fade-in slide-in-from-bottom-2">
                    {items.length > 1 && (
                        <button 
                            type="button" 
                            onClick={() => removeItem(idx)}
                            className="absolute top-2 right-2 text-neutral-500 hover:text-red-400 p-2"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                         <div>
                            <label className="text-xs text-neutral-500 block mb-1">Category</label>
                            <select 
                                value={it.category}
                                onChange={e => updateItem(idx, 'category', e.target.value)}
                                className="w-full bg-neutral-900 p-2 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none text-sm"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="text-xs text-neutral-500 block mb-1">Amount (RM)</label>
                            <input 
                                type="number" 
                                inputMode="decimal"
                                placeholder="0.00"
                                value={it.amount}
                                onChange={e => updateItem(idx, 'amount', e.target.value)}
                                className="w-full bg-neutral-900 p-2 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none font-bold"
                                required
                            />
                        </div>
                    </div>
                    <div>
                         <label className="text-xs text-neutral-500 block mb-1">Item / Description</label>
                         <input 
                            type="text" 
                            placeholder="e.g. NPK Green"
                            value={it.item}
                            onChange={e => updateItem(idx, 'item', e.target.value)}
                            className="w-full bg-neutral-900 p-2 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none text-sm"
                            required
                        />
                    </div>
                </div>
             ))}

             <button 
                type="button" 
                onClick={addItem}
                className="w-full py-3 border-2 border-dashed border-neutral-700 rounded-xl text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/50 transition flex items-center justify-center gap-2"
             >
                <Plus size={18} />
                Add Another Item
             </button>
        </div>


        {/* Receipt & Notes Common */}
        <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 space-y-4">
             {/* Receipt Photo */}
             <div>
                <label className="text-xs text-neutral-400 uppercase font-bold block mb-2">Receipt Photo</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-600 rounded-lg bg-neutral-900 cursor-pointer hover:bg-neutral-700 transition relative overflow-hidden">
                    {image ? (
                        <img src={image} alt="Preview" className="h-full object-contain" />
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
                 <label className="text-xs text-neutral-400 uppercase font-bold block mb-1">Notes</label>
                 <textarea 
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-neutral-900 p-3 rounded-lg border border-neutral-700 focus:border-emerald-500 outline-none"
                    placeholder="General notes for this receipt..."
                 />
            </div>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 w-full bg-neutral-900/90 backdrop-blur-md p-4 border-t border-white/10">
             <button 
                type="submit" 
                disabled={loading}
                className="w-full max-w-md mx-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save />}
                {loading ? 'Saving...' : `SAVE EXPENSE (RM ${totalAmount.toFixed(2)})`}
            </button>
        </div>

      </form>
    </div>
  );
}
