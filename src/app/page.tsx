import Link from 'next/link';
import { PlusCircle, TreePalm, FileBarChart, History } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white relative">
      {/* Hero / Header */}
      <div className="bg-gradient-to-br from-emerald-900 to-green-900 p-6 pb-12 rounded-b-3xl shadow-2xl">
        <h2 className="text-emerald-200 text-sm font-semibold tracking-wider mb-1">WELCOME HOME</h2>
        <h1 className="text-3xl font-bold mb-6">SoongGrow Farm</h1>
        
        {/* Quick Stats Widget (Mockup) */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex justify-between items-center">
            <div>
                <p className="text-xs text-emerald-200 uppercase">This Month Exp</p>
                <p className="text-2xl font-bold">RM --.--</p>
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
        <Link href="/expenses/add" className="col-span-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3 group">
            <div className="bg-emerald-800 p-3 rounded-full group-hover:bg-emerald-700 transition">
                <PlusCircle size={32} />
            </div>
            <span className="font-bold text-lg">New Expense</span>
        </Link>

        {/* Tree Manager */}
        <Link href="#" className="bg-neutral-800 hover:bg-neutral-750 active:scale-95 transition p-5 rounded-2xl border border-neutral-700 flex flex-col items-center justify-center gap-3">
             <TreePalm size={28} className="text-lime-400" />
             <span className="font-semibold text-neutral-300">My Trees</span>
        </Link>
        
        {/* Reports */}
        <Link href="#" className="bg-neutral-800 hover:bg-neutral-750 active:scale-95 transition p-5 rounded-2xl border border-neutral-700 flex flex-col items-center justify-center gap-3">
             <FileBarChart size={28} className="text-blue-400" />
             <span className="font-semibold text-neutral-300">Reports</span>
        </Link>

         {/* History */}
         <Link href="#" className="bg-neutral-800 hover:bg-neutral-750 active:scale-95 transition p-5 rounded-2xl border border-neutral-700 flex flex-col items-center justify-center gap-3">
             <History size={28} className="text-amber-400" />
             <span className="font-semibold text-neutral-300">History</span>
        </Link>

      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 w-full text-center text-neutral-600 text-xs">
        <p>SoongGrow v1.0 • Private System</p>
      </footer>
    </main>
  );
}
