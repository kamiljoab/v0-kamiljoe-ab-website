import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const service = formData.get('service') as string;
    const message = formData.get('message') as string;

    const files: File[] = [];
    for (const [_, value] of formData.entries()) {
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
    await drive.files.create({
      requestBody: textFileMetadata,
      media: {
        mimeType: 'text/plain',
        body: textFileContent,
      },
    });

    // Upload each file to Google Drive
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileMetadata = {
        name: file.name,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      };
      const media = {
        mimeType: file.type,
        body: buffer, // Google Drive API supports Buffer
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
