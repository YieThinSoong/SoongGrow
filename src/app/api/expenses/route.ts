import { NextRequest, NextResponse } from 'next/server';
import { addExpenses, getExpenses } from '@/lib/sheets';
import { uploadImage } from '@/lib/drive';

export async function GET() {
  try {
    const expenses = await getExpenses();
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const { date, items, image, notes, shopName, shopAddress, shopContact } = formData;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

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

    // Construct expense objects for each item
    const expenses = items.map((item: any) => ({
        date,
        category: item.category,
        item: item.item,
        amount: parseFloat(item.amount),
        image: imageUrl,
        notes,
        shopName,
        shopAddress,
        shopContact
    }));

    const result = await addExpenses(expenses);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
