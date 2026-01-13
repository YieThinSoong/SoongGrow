'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, MapPin, Phone, Store, Save, Loader2 } from 'lucide-react';

interface Shop {
  id?: string;
  name: string;
  address: string;
  contact: string;
}

export default function Shops() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: ''
  });

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await fetch('/api/shops');
      const data = await res.json();
      if (Array.isArray(data)) {
        setShops(data);
      }
    } catch (e) {
      console.error("Failed to fetch shops", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', address: '', contact: '' });
        setShowAddForm(false);
        fetchShops();
      } else {
        const err = await res.json();
        alert('Failed to save shop: ' + (err.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Error saving shop: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white pb-20">
      {/* Header */}
      <div className="bg-purple-900/50 backdrop-blur-md p-4 sticky top-0 z-10 flex items-center shadow-lg border-b border-white/10">
        <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-white/10 transition">
           <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
            <Store className="text-purple-400" />
            Shop Management
        </h1>
      </div>

      <div className="p-4 max-w-md mx-auto">
        
        {/* Add Shop Button / Form */}
        {!showAddForm ? (
             <button 
                onClick={() => setShowAddForm(true)}
                className="w-full bg-neutral-800 border-2 border-dashed border-neutral-700 hover:border-purple-500 hover:bg-neutral-750 text-neutral-400 hover:text-purple-400 p-4 rounded-xl flex items-center justify-center gap-2 transition mb-6"
             >
                <Plus />
                <span>Add New Shop</span>
             </button>
        ) : (
            <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
                <h3 className="font-bold text-lg mb-4 text-purple-400">Add New Shop</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-neutral-400 uppercase font-bold mb-1 block">Shop Name</label>
                        <input 
                            type="text" 
                            placeholder="My Farm Hardware"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-neutral-900 p-3 rounded-lg border border-neutral-700 focus:border-purple-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs text-neutral-400 uppercase font-bold mb-1 block">Address</label>
                        <textarea 
                            rows={2}
                            placeholder="123 Jalan Besar..."
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                            className="w-full bg-neutral-900 p-3 rounded-lg border border-neutral-700 focus:border-purple-500 outline-none"
                        />
                    </div>
                     <div>
                        <label className="text-xs text-neutral-400 uppercase font-bold mb-1 block">Contact</label>
                        <input 
                            type="text" 
                            placeholder="+6012-3456789"
                            value={formData.contact}
                            onChange={e => setFormData({...formData, contact: e.target.value})}
                            className="w-full bg-neutral-900 p-3 rounded-lg border border-neutral-700 focus:border-purple-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button 
                            type="button" 
                            onClick={() => setShowAddForm(false)}
                            className="flex-1 bg-neutral-700 hover:bg-neutral-600 p-3 rounded-lg font-bold"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="flex-1 bg-purple-600 hover:bg-purple-500 p-3 rounded-lg font-bold flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* Shop List */}
        {loading ? (
             <div className="flex justify-center p-8 text-neutral-500">
                <Loader2 className="animate-spin" />
             </div>
        ) : (
            <div className="space-y-3">
                {shops.length === 0 && !showAddForm && (
                     <div className="text-center p-8 text-neutral-500 bg-neutral-800/50 rounded-xl border border-white/5">
                        <Store size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No shops added yet.</p>
                     </div>
                )}
                {shops.map((shop, idx) => (
                    <div key={idx} className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 flex flex-col gap-2">
                         <div className="flex items-start justify-between">
                            <h3 className="font-bold text-lg text-emerald-100">{shop.name}</h3>
                         </div>
                         {(shop.address || shop.contact) && <hr className="border-neutral-700" />}
                         <div className="space-y-1 text-sm text-neutral-400">
                            {shop.address && (
                                <div className="flex items-start gap-2">
                                    <MapPin size={14} className="mt-1 shrink-0" />
                                    <span>{shop.address}</span>
                                </div>
                            )}
                             {shop.contact && (
                                <div className="flex items-center gap-2">
                                    <Phone size={14} />
                                    <span>{shop.contact}</span>
                                </div>
                            )}
                         </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
}
