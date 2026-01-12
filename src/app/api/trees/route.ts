import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { auth } from '@/lib/google';

export async function GET() {
    try {
        const sheets = google.sheets({ version: 'v4', auth });
        const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Trees!A2:F',
        });
        const rows = response.data.values || [];
        const trees = rows.map((row) => ({
            id: row[0],
            plot: row[1],
            plantingDate: row[2],
            status: row[3],
            lastInspected: row[4],
            photo: row[5],
        }));
        return NextResponse.json({ success: true, trees });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, plot, plantingDate, status, lastInspected, photo } = body;
        
        const sheets = google.sheets({ version: 'v4', auth });
        const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Trees!A:F',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[id, plot, plantingDate, status, lastInspected, photo || '']]
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
