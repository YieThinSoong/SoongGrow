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
  shopName?: string;
  shopAddress?: string;
  shopContact?: string;
}

export interface Tree {
  id: string;
  plot: string;
  plantingDate: string;
  status: 'Healthy' | 'Attention' | 'Dead';
  lastInspected: string;
  photo?: string;
}

export interface Shop {
  id?: string;
  name: string;
  address: string;
  contact: string;
}

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

if (!SPREADSHEET_ID) throw new Error('Missing GOOGLE_SHEET_ID');

export async function addExpenses(expenses: Expense[]) {
  const values = expenses.map(expense => [
    expense.date,
    expense.category,
    expense.item,
    expense.amount,
    expense.image || '',
    expense.notes || '',
    expense.shopName || '',
    expense.shopAddress || '',
    expense.shopContact || ''
  ]);

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Expenses!A:I', // Extended range for new columns
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: values,
    },
  });
  return response.data;
}

// Keep single add for backward compatibility if needed, using the new batch function
export async function addExpense(expense: Expense) {
  return addExpenses([expense]);
}

export async function getExpenses(): Promise<Expense[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Expenses!A2:I', // Fetch all columns including new Shop info
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
    shopName: row[6],
    shopAddress: row[7],
    shopContact: row[8],
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

// Shop Management
export async function addShop(shop: Shop) {
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Shops!A:C', 
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        shop.name,
        shop.address,
        shop.contact
      ]],
    },
  });
  return response.data;
}

export async function getShops(): Promise<Shop[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Shops!A2:C',
    });

    const rows = response.data.values || [];
    return rows.map((row, index) => ({
      id: (index + 2).toString(),
      name: row[0],
      address: row[1],
      contact: row[2],
    }));
  } catch (error) {
    // If sheet doesn't exist or is empty
    return []; 
  }
}
// Setup / Configuration
export async function configureSheets() {
    try {
        const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const existingSheets = meta.data.sheets?.map(s => s.properties?.title) || [];

        const requests = [];

        // 1. Ensure 'Shops' sheet exists
        if (!existingSheets.includes('Shops')) {
            requests.push({
                addSheet: {
                    properties: { title: 'Shops' }
                }
            });
        }
        
        // 2. Ensure 'Expenses' sheet exists (if using a fresh sheet)
        if (!existingSheets.includes('Expenses')) {
            requests.push({
                addSheet: {
                    properties: { title: 'Expenses' }
                }
            });
        }

        // 5. Ensure 'Trees' sheet exists
        if (!existingSheets.includes('Trees')) {
            requests.push({
                addSheet: {
                    properties: { title: 'Trees' }
                }
            });
        }

        // Execute Sheet Creation
        if (requests.length > 0) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: { requests }
            });
        }

        // 6. Add Headers to Shops if empty
        const shopsHeaders = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Shops!A1:C1'
        });

        if (!shopsHeaders.data.values || shopsHeaders.data.values.length === 0) {
             await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Shops!A1:C1',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [['Name', 'Address', 'Contact']]
                }
            });
        }
        
        // 7. Update Headers for Expenses
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Expenses!A1:I1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [['Date', 'Category', 'Item', 'Amount', 'Image', 'Notes', 'Shop Name', 'Shop Address', 'Shop Contact']]
            }
        });

        // 8. Add Headers to Trees if empty
        const treesHeaders = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Trees!A1:F1'
        });

        if (!treesHeaders.data.values || treesHeaders.data.values.length === 0) {
             await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Trees!A1:F1',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [['ID', 'Plot', 'Planting Date', 'Status', 'Last Inspected', 'Photo']]
                }
            });
        }

        return { success: true, created: requests.length > 0 };

    } catch (error) {
        console.error("Setup Error", error);
        throw error;
    }
}
