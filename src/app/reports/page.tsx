'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Download } from 'lucide-react';

export default function Reports() {
    const router = useRouter();
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchReport();
    }, [month]);

    const fetchReport = async () => {
        const res = await fetch(`/api/reports?month=${month}`);
        const json = await res.json();
        if (json.success) setData(json.summary);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            {/* Header (Hidden on Print) */}
            <div className="bg-white border-b p-4 flex items-center justify-between print:hidden sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft />
                    </button>
                    <h1 className="font-bold text-xl">Monthly Report</h1>
                </div>
                <button onClick={() => window.print()} className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-100">
                    <Printer size={18} /> Print PDF
                </button>
            </div>

            {/* Filter (Hidden on Print) */}
            <div className="p-4 print:hidden bg-white border-b">
                <label className="text-sm text-gray-500 mr-2">Select Month:</label>
                <input 
                    type="month" 
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>

            {/* Report Content (A4 Printable Area) */}
            <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen print:p-0 print:shadow-none shadow-xl my-8">
                
                {/* Letterhead */}
                <div className="text-center border-b pb-8 mb-8">
                    <h1 className="text-4xl font-bold text-emerald-800 tracking-wider mb-2">SOONGGROW</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Agriculture Management System</p>
                    <div className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-full font-bold">
                        {month} REPORT
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-8 mb-12">
                     <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Total Expenses</h3>
                        <p className="text-4xl font-bold text-black">
                            RM {data?.total?.toFixed(2) || '0.00'}
                        </p>
                     </div>
                     <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                         <h3 className="text-emerald-800 text-sm font-bold uppercase mb-2">Top Category</h3>
                         <p className="text-2xl font-bold text-emerald-900">
                             {/* Logic to find max category */}
                             {data?.byCategory ? Object.keys(data.byCategory).reduce((a, b) => data.byCategory[a] > data.byCategory[b] ? a : b, '-') : '-'}
                         </p>
                     </div>
                </div>

                {/* Category Breakdown Table */}
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Expense Breakdown</h3>
                <table className="w-full mb-12">
                    <thead>
                        <tr className="text-left text-xs uppercase text-gray-500">
                            <th className="py-2">Category</th>
                            <th className="py-2 text-right">Amount (RM)</th>
                            <th className="py-2 text-right">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.byCategory && Object.entries(data.byCategory).map(([cat, amount]: any) => (
                            <tr key={cat} className="border-b border-gray-100">
                                <td className="py-3 font-medium">{cat}</td>
                                <td className="py-3 text-right">{amount.toFixed(2)}</td>
                                <td className="py-3 text-right text-gray-500">
                                    {((amount / data.total) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Detailed Transactions */}
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Transaction History</h3>
                <div className="space-y-4">
                    {data?.expenses?.map((e: any, i: number) => (
                        <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2">
                             <div>
                                <p className="font-bold">{e.item}</p>
                                <p className="text-sm text-gray-500">{e.date} • {e.category}</p>
                                {e.notes && <p className="text-xs text-gray-400 italic">"{e.notes}"</p>}
                             </div>
                             <div className="flex items-center gap-4">
                                {e.image && (
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={e.image} alt="Receipt" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <span className="font-bold">RM {e.amount.toFixed(2)}</span>
                             </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-20 pt-8 border-t text-center text-gray-400 text-xs">
                    Generated by SoongGrow on {new Date().toLocaleDateString()}
                </div>

            </div>
        </div>
    );
}
