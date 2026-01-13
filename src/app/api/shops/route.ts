import { NextRequest, NextResponse } from 'next/server';
import { getShops, addShop } from '@/lib/sheets';

export async function GET() {
  try {
    const shops = await getShops();
    return NextResponse.json(shops);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, address, contact } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    await addShop({ name, address, contact });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
