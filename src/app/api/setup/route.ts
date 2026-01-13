import { NextResponse } from 'next/server';
// Force recompile
import { configureSheets } from '@/lib/sheets';

export async function GET() {
  try {
    const result = await configureSheets();
    return NextResponse.json({ 
        success: true, 
        message: 'Sheets configured successfully',
        details: result 
    });
  } catch (error: any) {
    return NextResponse.json({ 
        success: false, 
        error: error.message 
    }, { status: 500 });
  }
}
