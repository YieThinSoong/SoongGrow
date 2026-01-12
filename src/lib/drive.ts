import { google } from 'googleapis';
import { auth } from './google';
import { Readable } from 'stream';

const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!FOLDER_ID) throw new Error('Missing GOOGLE_DRIVE_FOLDER_ID');

export async function uploadImage(fileBuffer: Buffer, fileName: string, mimeType: string) {
  const stream = Readable.from(fileBuffer);

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [FOLDER_ID!],
    },
    media: {
      mimeType: mimeType,
      body: stream,
    },
    fields: 'id, webViewLink, webContentLink',
  });

  const fileId = response.data.id;
  
  // Make it readable by anyone with link (or just service account? - usually app needs to display it)
  // For simplicity, we'll keep it private to the user/service account, but if we want 
  // to display it in the <img> tag on the frontend, we might need to proxy it or make it public.
  // Let's set permissions to 'anyone' with 'reader' for now so it's easy to view in the app.
  if (fileId) {
      await drive.permissions.create({
          fileId,
          requestBody: {
              role: 'reader',
              type: 'anyone',
          }
      });
  }

  return response.data.webViewLink; // This link can be used in <img> tags
}
