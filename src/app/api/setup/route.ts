import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { auth } from '@/lib/google';

export async function GET() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

    if (!SPREADSHEET_ID) throw new Error('Missing ID');

    // Check existing sheets
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheetTitles = meta.data.sheets?.map(s => s.properties?.title) || [];

    const requests = [];

    // 1. Create 'Expenses' if missing
    if (!sheetTitles.includes('Expenses')) {
      requests.push({ addSheet: { properties: { title: 'Expenses' } } });
    }

    // 2. Create 'Trees' if missing
    if (!sheetTitles.includes('Trees')) {
       requests.push({ addSheet: { properties: { title: 'Trees' } } });
    }

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests }
      });
    }

    // 3. Add Headers
    // We do this blindly to ensure headers exist on row 1.
    // Ideally we check first, but writing headers to A1:F1 is safe enough for setup.
    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
            valueInputOption: 'USER_ENTERED',
            data: [
                {
                    range: 'Expenses!A1:F1',
                    values: [['Date', 'Category', 'Item', 'Amount', 'Image URL', 'Notes']]
                },
                {
                    range: 'Trees!A1:F1',
                    values: [['Tree ID', 'Plot/Block', 'Planting Date', 'Status', 'Last Inspected', 'Photo URL']]
                }
            ]
        }
    });

    return NextResponse.json({ success: true, message: "Database Initialized (Sheets Created)" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
