import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');

    // Collect all files.
    // We iterate over entries to mimic upload.any() which accepts files from any field.
    const files = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push(value);
      }
    }

    const timestamp = new Date().toISOString();

    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), '.env.local'),
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Create a text file with contact form details
    const textFileContent = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}\nTimestamp: ${timestamp}`;
    const textFileMetadata = {
      name: `contact_${timestamp}.txt`,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    // Google Drive API expects a stream or buffer for media body.
    await drive.files.create({
      requestBody: textFileMetadata,
      media: {
        mimeType: 'text/plain',
        body: textFileContent,
      },
    });

    // Upload each file to Google Drive
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileMetadata = {
        name: file.name,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      };

      const media = {
        mimeType: file.type,
        body: buffer,
      };

      await drive.files.create({
        requestBody: fileMetadata,
        media: media,
      });
    }

    return NextResponse.json({ message: 'Contact form submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to save data', { status: 500 });
  }
}
