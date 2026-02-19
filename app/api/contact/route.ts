import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export async function POST(req) {
  return new Promise((resolve, reject) => {
    upload.any()(req, {}, async (err) => {
      if (err) return reject(new Response('Error uploading files', { status: 400 }));

      const { name, email, phone, service, message } = req.body;
      const files = req.files;
      const timestamp = new Date().toISOString();

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      const drive = google.drive({ version: 'v3', auth });

      try {
        // Create a text file with contact form details
        const textFileContent = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}\nTimestamp: ${timestamp}`;
        const textFileMetadata = {
          name: `contact_${timestamp}.txt`,
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        };
        const textFile = await drive.files.create({
          requestBody: textFileMetadata,
          media: {
            mimeType: 'text/plain',
            body: textFileContent,
          },
        });

        // Upload each file to Google Drive
        for (const file of files) {
          const fileMetadata = {
            name: file.originalname,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
          };
          const media = {
            mimeType: file.mimetype,
            body: file.buffer,
          };
          await drive.files.create({
            requestBody: fileMetadata,
            media: media,
          });
        }

        return resolve(NextResponse.json({ message: 'Contact form submitted successfully!' }, { status: 200 }));
      } catch (error) {
        console.error(error);
        return reject(new Response('Failed to save data', { status: 500 }));
      }
    });
  });
}