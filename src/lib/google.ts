import { google } from 'googleapis';

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS');
}

export const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
});
