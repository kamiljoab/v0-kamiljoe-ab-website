import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const service = formData.get('service') as string;
    const message = formData.get('message') as string;

    const timestamp = new Date().toISOString();

    // Check if Google Drive environment variables are set
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      console.warn('GOOGLE_DRIVE_FOLDER_ID is not set. Skipping Drive upload.');
      // Return success in dev/mock mode
      return NextResponse.json({ message: 'Contact form submitted (mock mode)!' }, { status: 200 });
    }

    const auth = new google.auth.GoogleAuth({
      // Use GOOGLE_APPLICATION_CREDENTIALS env var for authentication
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

    return NextResponse.json({ message: 'Contact form submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
