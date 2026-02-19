import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Mock types since we don't have the full googleapis types installed properly in this environment
interface GoogleDrive {
  files: {
    list: (params: any) => Promise<any>;
    get: (params: any) => Promise<any>;
    create: (params: any) => Promise<any>;
    update: (params: any) => Promise<any>;
  }
}

async function findMessagesFile(drive: GoogleDrive, folderId: string) {
  try {
    const res = await drive.files.list({
      q: `name = 'messages.json' and '${folderId}' in parents and trashed = false`,
      fields: 'files(id, name)',
    });
    if (res.data?.files && res.data.files.length > 0) {
      return res.data.files[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error finding messages file:', error);
    return null;
  }
}

async function readMessages(drive: GoogleDrive, fileId: string) {
  try {
    const res = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    });
    // If the file is empty or invalid JSON, return empty array
    if (!res.data || (typeof res.data === 'string' && res.data.trim() === '')) {
      return [];
    }
    return res.data; // axios response data is already parsed JSON if header is correct
  } catch (error) {
    console.error('Error reading messages file:', error);
    return [];
  }
}

export async function GET() {
  try {
    // Check if Google Drive environment variables are set
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
       // Return mock data for dev environment without credentials
       return NextResponse.json([
         { id: 1, name: "Test User (Mock)", email: "test@example.com", phone: "123456789", service: "Test Service", message: "This is a mock message from the server.", timestamp: new Date().toISOString(), read: false }
       ]);
    }

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    const drive = google.drive({ version: 'v3', auth }) as unknown as GoogleDrive;

    const fileId = await findMessagesFile(drive, process.env.GOOGLE_DRIVE_FOLDER_ID);

    if (!fileId) {
      return NextResponse.json([]);
    }

    const messages = await readMessages(drive, fileId);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const service = formData.get('service') as string;
    const message = formData.get('message') as string;

    const timestamp = new Date().toISOString();
    const newMessage = {
      id: Date.now(),
      name,
      email,
      phone,
      service,
      message,
      timestamp,
      read: false
    };

    // Check if Google Drive environment variables are set
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      console.warn('GOOGLE_DRIVE_FOLDER_ID is not set. Skipping Drive upload.');
      return NextResponse.json({ message: 'Contact form submitted (mock mode)!' }, { status: 200 });
    }

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    const drive = google.drive({ version: 'v3', auth }) as unknown as GoogleDrive;

    let fileId = await findMessagesFile(drive, process.env.GOOGLE_DRIVE_FOLDER_ID);
    let messages: any[] = [];

    if (fileId) {
      const existing = await readMessages(drive, fileId);
      if (Array.isArray(existing)) {
        messages = existing;
      }
    }

    messages.push(newMessage);

    const fileMetadata = {
      name: 'messages.json',
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(messages, null, 2),
    };

    if (fileId) {
      // Update existing file
      await drive.files.update({
        fileId: fileId,
        media: media,
      });
    } else {
      // Create new file
      await drive.files.create({
        requestBody: fileMetadata,
        media: media,
      });
    }

    return NextResponse.json({ message: 'Contact form submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
