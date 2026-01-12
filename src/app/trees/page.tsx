'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, AlertTriangle, CheckCircle, Skull } from 'lucide-react';

interface Tree {
    id: string;
    plot: string;
    status: string;
}

export default function TreeManager() {
    const router = useRouter();
    const [trees, setTrees] = useState<Tree[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newTree, setNewTree] = useState({ id: '', plot: '', status: 'Healthy' });

    useEffect(() => {
        fetchTrees();
    }, []);

    const fetchTrees = async () => {
        try {
            const res = await fetch('/api/trees');
            const data = await res.json();
            if (data.success) setTrees(data.trees);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await fetch('/api/trees', {
            method: 'POST',
            body: JSON.stringify({ ...newTree, plantingDate: new Date().toISOString().split('T')[0], lastInspected: new Date().toISOString().split('T')[0] })
        });
        setNewTree({ id: '', plot: '', status: 'Healthy' });
        setShowAdd(false);
        fetchTrees();
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Attention': return <AlertTriangle className="text-amber-500" />;
            case 'Dead': return <Skull className="text-red-500" />;
            default: return <CheckCircle className="text-emerald-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white pb-20">
            {/* Header */}
            <div className="bg-emerald-900 p-4 sticky top-0 z-10 flex items-center shadow-lg justify-between">
                <div className="flex items-center">
                    <button onClick={() => router.back()} className="mr-3 p-2 rounded-full hover:bg-emerald-800">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-xl font-bold">My Trees</h1>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="bg-emerald-600 p-2 rounded-full shadow-lg">
                    <Plus />
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 p-4">
                <div className="bg-neutral-800 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-400">{trees.filter(t => t.status === 'Healthy').length}</p>
                    <p className="text-xs text-neutral-400">Healthy</p>
                </div>
                <div className="bg-neutral-800 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-amber-400">{trees.filter(t => t.status === 'Attention').length}</p>
                    <p className="text-xs text-neutral-400">Attention</p>
                </div>
                <div className="bg-neutral-800 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-red-400">{trees.filter(t => t.status === 'Dead').length}</p>
                    <p className="text-xs text-neutral-400">Dead</p>
                </div>
            </div>

            {/* Add Form Overlay */}
            {showAdd && (
                <div className="bg-neutral-800 m-4 p-4 rounded-xl border border-neutral-700 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold mb-4">Add New Tree</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                placeholder="Tree ID (e.g. A-01)" 
                                value={newTree.id}
                                onChange={e => setNewTree({...newTree, id: e.target.value})}
                                className="bg-neutral-900 p-3 rounded-lg border border-neutral-700"
                                required
                            />
                             <input 
                                placeholder="Plot (e.g. Block A)" 
                                value={newTree.plot}
                                onChange={e => setNewTree({...newTree, plot: e.target.value})}
                                className="bg-neutral-900 p-3 rounded-lg border border-neutral-700"
                                required
                            />
                        </div>
                        <select 
                            value={newTree.status}
                            onChange={e => setNewTree({...newTree, status: e.target.value})}
                            className="w-full bg-neutral-900 p-3 rounded-lg border border-neutral-700"
                        >
                            <option value="Healthy">Healthy</option>
                            <option value="Attention">Attention Required</option>
                            <option value="Dead">Dead / Removed</option>
                        </select>
                        <button type="submit" className="w-full bg-emerald-600 p-3 rounded-lg font-bold flex items-center justify-center gap-2">
                            <Save size={18} /> Save Tree
                        </button>
                    </form>
                </div>
            )}

            {/* Tree List */}
            <div className="px-4 space-y-3">
                {trees.map((tree, i) => (
                    <div key={i} className="bg-neutral-800 p-4 rounded-xl flex items-center justify-between border border-neutral-700/50">
                        <div className="flex items-center gap-4">
                            <div className="bg-neutral-900 p-2 rounded-lg">
                                {getStatusIcon(tree.status)}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{tree.id}</p>
                                <p className="text-sm text-neutral-400">{tree.plot}</p>
                            </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                            tree.status === 'Healthy' ? 'border-emerald-500/30 text-emerald-500' :
                            tree.status === 'Attention' ? 'border-amber-500/30 text-amber-500' :
                            'border-red-500/30 text-red-500'
                        }`}>
                            {tree.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
