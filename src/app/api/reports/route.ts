import { NextRequest, NextResponse } from 'next/server';
import { getExpenses } from '@/lib/sheets';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month'); // "2026-01"

        const allExpenses = await getExpenses();
        
        let filtered = allExpenses;
        if (month) {
            filtered = allExpenses.filter(e => e.date.startsWith(month));
        }

        // Aggregate by Category
        const byCategory: Record<string, number> = {};
        let total = 0;

        filtered.forEach(e => {
            byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
            total += e.amount;
        });

        return NextResponse.json({ 
            success: true, 
            summary: {
                total,
                byCategory,
                expenses: filtered
            } 
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
