import { NextRequest, NextResponse } from 'next/server';
import { addExpense } from '@/lib/sheets';
import { uploadImage } from '@/lib/drive';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const { date, category, item, amount, image, notes } = formData;

    let imageUrl = '';

    // Handle Image Upload if present (Base64 string)
    if (image && image.startsWith('data:image')) {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `receipt_${Date.now()}.jpg`; // Simple naming
        
        try {
            imageUrl = await uploadImage(buffer, filename, mimeType) || '';
        } catch (e) {
            console.error("Drive Upload Error:", e);
            // Continue saving expense even if image fails, but log it
        }
      }
    }

    const expense = {
        date,
        category,
        item,
        amount: parseFloat(amount),
        image: imageUrl,
        notes
    };

    const result = await addExpense(expense);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
