'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Filter, Calendar } from 'lucide-react';

interface Expense {
    date: string;
    category: string;
    item: string;
    amount: number;
    shopName?: string;
    image?: string;
    notes?: string;
}

interface GroupedExpense {
    id: string;
    date: string;
    shopName?: string;
    totalAmount: number;
    items: Expense[];
    image?: string;
    notes?: string;
}

export default function History() {
    const router = useRouter();
    const [groupedExpenses, setGroupedExpenses] = useState<GroupedExpense[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [monthFilter, setMonthFilter] = useState('');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await fetch('/api/expenses');
            const data = await res.json();
            if (Array.isArray(data)) {
                
                // Grouping Logic
                const groups: Record<string, GroupedExpense> = {};
                
                data.forEach((exp: Expense) => {
                    // Create a unique key for the "Entry"
                    // We group by Date + Shop + Image (highly likely to be same entry)
                    // If no shop, we group by Date + Notes
                    const key = `${exp.date}|${exp.shopName || ''}|${exp.image || ''}|${exp.notes || ''}`;
                    
                    if (!groups[key]) {
                        groups[key] = {
                            id: key,
                            date: exp.date,
                            shopName: exp.shopName,
                            totalAmount: 0,
                            items: [],
                            image: exp.image,
                            notes: exp.notes
                        };
                    }
                    
                    groups[key].items.push(exp);
                    groups[key].totalAmount += exp.amount;
                });

                // Convert to array and sort by date
                const sortedGroups = Object.values(groups).sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setGroupedExpenses(sortedGroups);
            }
        } catch (e) {
            console.error("Failed to fetch expenses", e);
        } finally {
            setLoading(false);
        }
    };

    const filteredGroups = groupedExpenses.filter(group => {
        const matchesMonth = monthFilter ? group.date.startsWith(monthFilter) : true;
        
        if (!searchTerm) return matchesMonth;

        const searchLower = searchTerm.toLowerCase();
        const matchesShop = (group.shopName || '').toLowerCase().includes(searchLower);
        const matchesItems = group.items.some(item => 
            item.item.toLowerCase().includes(searchLower) || 
            item.category.toLowerCase().includes(searchLower)
        );

        return matchesMonth && (matchesShop || matchesItems);
    });

    const totalFiltered = filteredGroups.reduce((sum, g) => sum + g.totalAmount, 0);

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-neutral-900 z-10 py-2">
                <button onClick={() => router.back()} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700">
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-bold">History</h1>
            </div>

            {/* Filters */}
            <div className="space-y-3 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-neutral-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search items, shops..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-800 pl-10 p-3 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-3 text-neutral-500" size={18} />
                        <input 
                            type="month" 
                            value={monthFilter}
                            onChange={e => setMonthFilter(e.target.value)}
                            className="w-full bg-neutral-800 pl-10 p-3 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-emerald-900/30 border border-emerald-500/30 p-4 rounded-xl mb-6 flex justify-between items-center">
                <span className="text-emerald-200 text-sm font-bold uppercase">Total Found</span>
                <span className="text-xl font-bold text-white">RM {totalFiltered.toFixed(2)}</span>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-neutral-500 animate-pulse">Loading history...</p>
                ) : filteredGroups.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500">
                        <Filter className="mx-auto mb-2 opacity-50" />
                        <p>No expenses found</p>
                    </div>
                ) : (
                    filteredGroups.map((group) => (
                        <div key={group.id} className="bg-neutral-800 rounded-xl border border-neutral-700/50 overflow-hidden">
                            
                            {/* Card Header (Entry Info) */}
                            <div className="p-4 border-b border-neutral-700/50 bg-neutral-750 flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-lg mb-1">{group.date}</div>
                                    {group.shopName && (
                                        <div className="flex items-center gap-1 text-sm text-emerald-400">
                                            <StoreIcon /> {group.shopName}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-xl text-emerald-400">RM {group.totalAmount.toFixed(2)}</div>
                                    <div className="text-xs text-neutral-500">{group.items.length} items</div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="p-4 space-y-3">
                                {group.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-medium text-white">{item.item}</p>
                                            <p className="text-xs text-neutral-400 bg-neutral-900 inline-block px-2 py-0.5 rounded mt-1">{item.category}</p>
                                        </div>
                                        <p className="text-neutral-300">RM {item.amount.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Footer (Notes & Image) */}
                            {(group.notes || group.image) && (
                                <div className="p-3 bg-neutral-900/50 text-xs text-neutral-400 space-y-2">
                                    {group.notes && (
                                        <p className="italic">" {group.notes} "</p>
                                    )}
                                    {group.image && (
                                        <div className="mt-2">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={group.image} alt="Receipt" className="h-16 rounded border border-neutral-700 object-cover" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function StoreIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
            <path d="M2 7h20"/>
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
        </svg>
    );
}
