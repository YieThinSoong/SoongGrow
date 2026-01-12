import { google } from 'googleapis';
import { auth } from './google';

// Types
export interface Expense {
  id?: string; // Row index
  date: string;
  category: string;
  item: string;
  amount: number;
  image?: string;
  notes?: string;
}

export interface Tree {
  id: string;
  plot: string;
  plantingDate: string;
  status: 'Healthy' | 'Attention' | 'Dead';
  lastInspected: string;
  photo?: string;
}

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

if (!SPREADSHEET_ID) throw new Error('Missing GOOGLE_SHEET_ID');

export async function addExpense(expense: Expense) {
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Expenses!A:F', // Assumes Sheet is named 'Expenses'
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        expense.date,
        expense.category,
        expense.item,
        expense.amount,
        expense.image || '',
        expense.notes || ''
      ]],
    },
  });
  return response.data;
}

export async function getExpenses(): Promise<Expense[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Expenses!A2:F', // Skip header
  });

  const rows = response.data.values || [];
  return rows.map((row, index) => ({
    id: (index + 2).toString(), // Row number as ID
    date: row[0],
    category: row[1],
    item: row[2],
    amount: parseFloat(row[3] || '0'),
    image: row[4],
    notes: row[5],
  }));
}

export async function getTrees(): Promise<Tree[]> {
   const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Trees!A2:F',
  });

  const rows = response.data.values || [];
  return rows.map((row) => ({
    id: row[0],
    plot: row[1],
    plantingDate: row[2],
    status: row[3] as any,
    lastInspected: row[4],
    photo: row[5],
  }));
}
