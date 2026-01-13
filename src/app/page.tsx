'use client';

import Link from 'next/link';
import { PlusCircle, TreePalm, FileBarChart, History, Store, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [currentMonthExp, setCurrentMonthExp] = useState(0);

  useEffect(() => {
    fetch('/api/expenses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth(); // 0-indexed

            const total = data.reduce((acc, exp) => {
                const expDate = new Date(exp.date);
                if (expDate.getFullYear() === year && expDate.getMonth() === month) {
                    return acc + (parseFloat(exp.amount) || 0);
                }
                return acc;
            }, 0);
            setCurrentMonthExp(total);
        }
      })
  }, []);

  return (
    <main className="min-h-screen bg-neutral-900 text-white relative">
      {/* Hero / Header */}
      <div className="bg-gradient-to-br from-emerald-900 to-green-900 p-2 pb-2 rounded-b-3xl shadow-2xl">
        <h2 className="text-emerald-200 text-sm font-semibold tracking-wider relative z-10 translate-y-2">WELCOME HOME</h2>
        <div className="flex items-center -mt-12 -mb-10">
            <button onClick={() => setShowLogoModal(true)} className="hover:opacity-80 transition active:scale-95">
                <img src="/images/S_Logo.png" alt="SoongGrow Logo" className="w-54 h-54 object-contain" />
            </button>
            <h1 className="text-xl font-bold -ml-8 relative z-10 mt-4">SoongGrow</h1>
        </div>
        
        {/* Quick Stats Widget (Mockup) */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex justify-between items-center">
            <div>
                <p className="text-xs text-emerald-200 uppercase">This Month Exp</p>
                <p className="text-2xl font-bold">RM {currentMonthExp.toFixed(2)}</p>
            </div>
            <div className="h-10 w-[1px] bg-white/20"></div>
            <div>
                 <p className="text-xs text-emerald-200 uppercase">Tree Health</p>
                 <p className="text-xl font-bold text-emerald-400">0 Alerts</p>
            </div>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="p-6 -mt-8 grid grid-cols-2 gap-4">
        
        {/* Add Expense - Primary Action */}
        <Link href="/expenses/add" className="col-span-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition p-6 rounded-xl shadow-lg flex flex-col items-center justify-center gap-3 group">
            <div className="bg-emerald-800 p-1 rounded-full group-hover:bg-emerald-700 transition">
                <PlusCircle size={28} />
            </div>
            <span className="font-bold text-lg">New Expense</span>
        </Link>

        {/* Tree Manager */}
        <Link href="/trees" className="bg-neutral-800 hover:bg-neutral-750 active:scale-95 transition p-5 rounded-2xl border border-neutral-700 flex flex-col items-center justify-center gap-3">
             <TreePalm size={28} className="text-lime-400" />
             <span className="font-semibold text-neutral-300">My Trees</span>
        </Link>
        
        {/* Reports */}
        <Link href="/reports" className="bg-neutral-800 hover:bg-neutral-750 active:scale-95 transition p-5 rounded-2xl border border-neutral-700 flex flex-col items-center justify-center gap-3">
             <FileBarChart size={28} className="text-blue-400" />
             <span className="font-semibold text-neutral-300">Reports</span>
        </Link>

         {/* History */}
         <Link href="/history" className="bg-neutral-800 hover:bg-neutral-750 active:scale-95 transition p-5 rounded-2xl border border-neutral-700 flex flex-col items-center justify-center gap-3">
             <History size={28} className="text-amber-400" />
             <span className="font-semibold text-neutral-300">History</span>
        </Link>

         {/* Shops */}
         <Link href="/shops" className="bg-neutral-800 hover:bg-neutral-750 active:scale-95 transition p-5 rounded-2xl border border-neutral-700 flex flex-col items-center justify-center gap-3">
             <Store size={28} className="text-purple-400" />
             <span className="font-semibold text-neutral-300">Shops</span>
        </Link>

      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 w-full text-center text-neutral-600 text-xs">
        <p>SoongGrow v1.0 • Private System</p>
      </footer>

      {/* Logo Modal */}
      {showLogoModal && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setShowLogoModal(false)}
        >
            <div className="relative flex flex-col items-center text-center p-8 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => setShowLogoModal(false)}
                    className="absolute top-0 right-0 p-2 text-white/50 hover:text-white"
                >
                    <X size={24} />
                </button>
                
                <img 
                    src="/images/S_Image.png" 
                    alt="SoongGrow Logo Large" 
                    className="w-84 h-84 object-contain mb-6 animate-in zoom-in-50 duration-300" 
                />
                
                <div className="space-y-2 animate-in slide-in-from-bottom-4 delay-100 duration-500">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                        SoongGrow
                    </h2>
                    <p className="text-lg text-emerald-100 font-light italic flex flex-col gap-1">
                        <span>Growing Together.</span>
                        <span>Growing Soong.</span>
                    </p>
                </div>
            </div>
        </div>
      )}
    </main>
  );
}
